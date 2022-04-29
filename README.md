# eip721 学习笔记

ERC 721 接口设计

```
interface IERC721 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
    function approve(address to, uint256 tokenId) external;
    function setApprovalForAll(address operator, bool _approved) external;
    function getApproved(uint256 tokenId) external view returns (address operator);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface IERC721Metadata is IERC721 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);
}

interface IERC721Enumerable is IERC721 {
    function totalSupply() external view returns (uint256);
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);
    function tokenByIndex(uint256 index) external view returns (uint256);
}
```

OpenZeppelin 的实现：https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol



Azuki 的 ERC721A：

```
interface IERC721A is IERC721, IERC721Metadata {
    error ApprovalCallerNotOwnerNorApproved();
    error ApprovalQueryForNonexistentToken();
    error ApproveToCaller();
    error ApprovalToCurrentOwner();
    error BalanceQueryForZeroAddress();
    error MintToZeroAddress();
    error MintZeroQuantity();
    error OwnerQueryForNonexistentToken();
    error TransferCallerNotOwnerNorApproved();
    error TransferFromIncorrectOwner();
    error TransferToNonERC721ReceiverImplementer();
    error TransferToZeroAddress();
    error URIQueryForNonexistentToken();

    // Compiler will pack this into a single 256bit word.
    struct TokenOwnership {
        // The address of the owner.
        address addr;
        // Keeps track of the start time of ownership with minimal overhead for tokenomics.
        uint64 startTimestamp;
        // Whether the token has been burned.
        bool burned;
    }

    // Compiler will pack this into a single 256bit word.
    struct AddressData {
        // Realistically, 2**64-1 is more than enough.
        uint64 balance;
        // Keeps track of mint count with minimal overhead for tokenomics.
        uint64 numberMinted;
        // Keeps track of burn count with minimal overhead for tokenomics.
        uint64 numberBurned;
        // For miscellaneous variable(s) pertaining to the address
        // (e.g. number of whitelist mint slots used).
        // If there are multiple variables, please pack them into a uint64.
        uint64 aux;
    }

    function totalSupply() external view returns (uint256);
}
```

实现： https://github.com/chiru-labs/ERC721A/blob/main/contracts/ERC721A.sol


主要区别：

- OZ 的 ERC721Enumerable 比较严格的按照 EIP-721 执行，不提倡 token id 自增
- Azuki 会觉得反正开发者都用的是 tokenId 从零开始自增，那就把这个弄成标准
- OZ 会在内存里保存两个个 index <-> tokenId 的 mapping，一个是用户的 tokenList，一个是合约 mint 出来的 所有的 tokenList
- Azuki 砍掉了这些 tokenList 的 mapping， 也不用没次 mint 去更新和维护他们，就节省了内存
- OZ 的 mint 参数是 (address, tokenId), 一次 mint 一个，可以为 NFT 指定 tokenId
- Azuki mint 参数是 (address, quantity), 一次 mint n 个，这 n 个 NFTs 的 tokenIds 是从 currentId 开始连续自增的
- Azuki 的省钱优势在批量 mint 时比较明显，市场上部分项目方一般允许 mint 2 到 3 个，也有的可以mint 20 个或者更多