//SPDX-License-Identifier:MIT
pragma solidity 0.8.7;

//here creating the rentalNFTMarketplace 
//here we use ERC-20 and ERC-4907 standards

import "./NFTcontract.sol";


contract RentalNFTMarketplace{
    struct listOfSellers{
        address seller;
        uint price;
    }
    address payable owner;                                      //deployer of the contract
    mapping(address => mapping(uint => listOfSellers)) sellers; //NFT contract address => tokenID => struct details
    constructor(){
        owner = payable(msg.sender);
    }

    //events


    //modifiers
    modifier isOwnerAndApproved(address _nft,uint _tokenId){
        NFT contractAddress = NFT(_nft);
        require(contractAddress.ownerOf(_tokenId)==msg.sender,"not the owner of the nft");
        require(contractAddress.getApproved(_tokenId)!=address(this),"NFT is not approved");
        _;
    }

    modifier listedOrNot(address _nft,uint _tokenId){
        require(sellers[_nft][_tokenId].price > 0 wei,"aleardy listed");
        _;
    }

    modifier mandatory{
        require(owner!=msg.sender,"owner can't spam the marketplace");
        require(msg.value >= 100 wei,"you should pay 100 wei to register into marketplace");
        _;
    }



    // 1.register the sellers and add the NFT's into marketplace
    // 1.1 check aleardy listed or not   modifier:ListedOrNot()
    // 1.2 does nft existed at that address or not(nftContract address is required)  modifier: isOwner()
    // 1.3 the seller should approve the contract to transferFrom() after the sale of NFT from marketplace

    function registerSellers(address _nft,uint _tokenId,uint _price)external payable 
    isOwnerAndApproved(_nft,_tokenId)listedOrNot(_nft,_tokenId)mandatory{
        sellers[_nft][_tokenId].price=_price;
        sellers[_nft][_tokenId].seller=msg.sender;
    }






}

