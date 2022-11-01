//SPDX-License-Identifier:MIT
pragma solidity 0.8.7;

contract RegisterAndLogin{
    struct User{
        bytes name;
        bytes32 password;
        bool register;
        bool login;
    }

    mapping(address => User) public details;

    //events
    event registeredUser(address indexed user,bytes indexed name);
    event loginUser(address indexed user, bytes indexed name);
    event logoutUser(address indexed user);

    //modifiers
    modifier registerTheUser{
        require(details[msg.sender].register==false,"aleardy user");
        _;
    }

    modifier loginTheUser(bytes memory _name,bytes32 _password){
        require(details[msg.sender].register!=false,"register first");
        require(keccak256(details[msg.sender].name) == keccak256(_name),"user not existed. create Account");
        require(details[msg.sender].password ==keccak256(abi.encodePacked(_password)),"Inccorrect password entered");
        _;
    }

    modifier logoutTheUser{
        require(details[msg.sender].login==true,"Login first to Logout");
        _;
    }


    //functions 
    function registerUser(bytes memory _name,bytes32 _password)external registerTheUser{
        details[msg.sender].name = _name;
        details[msg.sender].password = keccak256(abi.encodePacked(_password));
        details[msg.sender].register=true;
        emit registeredUser(msg.sender,_name);
    }

    function CheckUserToLogin(bytes memory _name,bytes32 _password)external loginTheUser(_name,_password) returns(bool ){
        details[msg.sender].login=true;
        emit loginUser(msg.sender,_name);
        return true;
    }

    function checkUserToLogOut()external logoutTheUser returns(bool ){
        details[msg.sender].login=false;
        emit logoutUser(msg.sender);
        return true;
    }

    
    function printUserName()external view returns(bytes memory){
        return details[msg.sender].name;
    }

    function printPassword()external view returns(bytes32 ){
        return details[msg.sender].password;
    }
}
