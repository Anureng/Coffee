//SPDX-License-Identifier:MIT

pragma solidity 0.8.9;

contract Coffee{

  address payable owner;

  constructor(){
      owner=payable(msg.sender);
  }

     event NewMemo(
      address indexed from,
      uint timestamp,
      string name,
      string  message
     );
  
  struct Memo{
      address from;
       uint timestamp;
      string name;
      string message;
  }

  Memo[] memos;

   function buyCoffee(string memory _name,string memory _message) payable public{
       require(msg.value>0 ,"0 is not");
       memos.push(Memo(msg.sender,block.timestamp,_name,_message));
emit NewMemo(msg.sender,block.timestamp,_name,_message);
   }
  
function withdrawTips() public{
    require(owner.send(address(this).balance));
}

function getMemo() public view returns(Memo[] memory){
    return memos;
}
}

 
