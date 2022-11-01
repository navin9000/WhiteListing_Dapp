const {ethers,waffle} = require("hardhat");
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");

//Testing the login functionality

describe("Testing user registration",function(){
    async function deployLoadfixture(){
        const [owner,addr1,addr2,addr3,addr4] = await ethers.getSigners();
        const factoryObject = await ethers.getContractFactory("RegisterAndLogin");
        const contractObject = await factoryObject.deploy();
        await contractObject.deployed();
        return {owner,addr1,addr2,addr3,addr4,contractObject};
    }
    it("regestration testing",async function(){
        const {owner,addr1,addr2,add3,addr4,contractObject}=await loadFixture(deployLoadfixture);
         
        //owner registering into the page(default caller is owner)
        //owner username 
        const username = await ethers.utils.formatBytes32String("naveen");
        const namehash = await ethers.utils.keccak256(username);
        console.log("owner details : ");
        console.log("username :",username);
        const password = await ethers.utils.formatBytes32String("naveen@9000");
        const passwordHash = await ethers.utils.keccak256(password);
        console.log("password :",passwordHash);
        await contractObject.registerUser(namehash,passwordHash);
        const check = await contractObject.CheckUserToLogin(namehash,passwordHash);
        if(check){
            console.log("login successfull");
        }
        else{
            console.log("login failed");
        }
    });


    //Test -1 :
    //to check login without regestering into the page

    it("Login without registering into the page :",async function(){
        const {owner,addr1,addr2,add3,addr4,contractObject}=await loadFixture(deployLoadfixture);

        const username = await ethers.utils.formatBytes32String("naveen");
        const namehash = await ethers.utils.keccak256(username);
        const password = await ethers.utils.formatBytes32String("naveen@9000");
        const passwordHash = await ethers.utils.keccak256(password);
        await contractObject.CheckUserToLogin(namehash,passwordHash);
        
    });



    //Test -2:
    //Using different account with owner credentials
    //If you know the username and password u cant login to it 
    it("If you know the username and password u cant login to it",async function(){
        const {owner,addr1,addr2,add3,addr4,contractObject}=await loadFixture(deployLoadfixture);
        
        const username = await ethers.utils.formatBytes32String("bravo");
        const namehash = await ethers.utils.keccak256(username);
        const password = await ethers.utils.formatBytes32String("bravo@8976");
        const passwordHash = await ethers.utils.keccak256(password);
        await contractObject.registerUser(namehash,passwordHash);
        const check2 = await contractObject.connect(addr1).CheckUserToLogin(namehash,passwordHash);
        if(check2){
            console.log("login successfull");
        }
        else{
            console.log("login failed");
        }
    });


    //Test -3 :
    // same user registering with multiple times
    it("One user regestering multiple times ",async function(){
        const {owner,addr1,addr2,add3,addr4,contractObject}=await loadFixture(deployLoadfixture);
        const username1 = await ethers.utils.formatBytes32String("naveen");
        const usernamehash = await ethers.utils.keccak256(username1);
        const password = await ethers.utils.formatBytes32String("naveen@1234");
        const passwordhash = await ethers.utils.keccak256(password);
        await contractObject.registerUser(usernamehash,passwordhash);
        //duplicate 
        await contractObject.registerUser(usernamehash,passwordhash);

    });

    //Test - 4:
    //Regestering with multiple users
    it("restering with multiple users",async function(){
        const {owner,addr1,addr2,add3,addr4,contractObject}=await loadFixture(deployLoadfixture);

        const username1 = await ethers.utils.formatBytes32String("naveen");
        
    });

    //Test - 5:
    //same usernames can be possible for multiple accounts
    it("same username can be possible for multiple accounts with different EOA:",async function(){
        const {owner,addr1,addr2,add3,addr4,contractObject}=await loadFixture(deployLoadfixture);
        const u1 = await ethers.utils.formatBytes32String("ramakrishna");
        const uh1 = await ethers.utils.keccak256(u1);
        const up1 = await ethers.utils.formatBytes32String("ramakrishna");
        const uph1 = await ethers.utils.keccak256(up1);
        console.log("user_1 username:",uh1);
        console.log("user_1 password:",up1);
        //register
        await contractObject.registerUser(uh1,uph1);   //with default account
        await contractObject.connect(addr1).registerUser(uh1,uph1);   //with addr1 account
        //login
        const  user1 = await contractObject.CheckUserToLogin(uh1,uph1);
        if(user1){
            console.log("user1 login successfull");
        }
        else{
            console.log("user1 login failed");
        }
        const user2  = await contractObject.connect(addr1).CheckUserToLogin(uh1,uph1);
        if(user2){
            console.log("user2 login successfull");
        }
        else{
            console.log("user2 login failed");
        }
    });


});