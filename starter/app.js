// module creation for data privacy and code structuring




//Budget module
var budgetController = (function (){


 var Expense = function(id,description,value){
     this.id=id;
     this.description=description;
     this.value=value;
     this.percentage=-1;
 } ;
    
    
    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome>0){
            this.percentage =Math.round(this.value/totalIncome*100);
        }else{
            this.percentage=-1;
        }
    };
    
    Expense.prototype.getPerc = function(){
        return this.percentage;
    }
 
 var Income = function(id,description,value){
     this.id=id;
     this.description=description;
     this.value=value;
 } ; 
    
    
var data = {
    allitems :{
        exp:[],
        inc:[]
    },
    totals:{
        exp:0,
        inc:0
    },
    budget: 0,
    percentage:-1
    
}
var calculateTotal = function (type){
    var sum=0;
    data.allitems[type].forEach(function(current){
        sum +=current.value;
    })
    data.totals[type] = sum;
};

return {
    
       addItems: function(type,des,val){
           var newItem,ID;
           
           //creating new Id based on last element  of the string newItem which will occupy allitems +1
           if(data.allitems[type].length>0){
              ID = data.allitems[type][data.allitems[type].length-1].id + 1; 
            
           }else{
               ID =0;
           }
           
           //create newItem based on inc or exp
           if(type === 'exp'){
              newItem = new Expense(ID, des, val);
        }else if(type === 'inc'){
            newItem = new Income(ID, des, val);
        }
         //push the newItem into our data structure
           data.allitems[type].push(newItem);
           
           //return the newItem
           return newItem;
       },
    calculateBudget: function(){
    //1.calculate total income and expense
     calculateTotal('inc');
     calculateTotal('exp');
        
        
    //2.deduce budget by substraction
    data.budget = data.totals.inc - data.totals.exp;
        
    //3.calculate % of income spent which is expense
        if(data.totals.inc >0){
            data.percentage = Math.round(data.totals.exp/data.totals.inc*100);
        }else{
            data.percentage= -1;
        }
        
        
    },
    getBudget: function(){
        return{
            budget:data.budget,
            totalInc:data.totals.inc,
            totalExp:data.totals.exp,
            percentage:data.percentage
        }
    },
    deleteItem: function(type,id){
        var ids,index;
        
        ids = data.allitems[type].map(function(current){
            return current.id;
        });
        
        index = ids.indexOf(id);
        
        if(index !== -1){
            data.allitems[type].splice(index,1);
        }
        
    },
    calculatePercentage: function(){
        
        data.allitems.exp.forEach(function(curr){
            curr.calcPercentage(data.totals.inc);
        });
        
      
        
        
        
    },
    
    getPercentage:function(){
      
        allPerc = data.allitems.exp.map(function(curr){
            return curr.getPerc();
        });
        
        return allPerc;
        
        
    },
    
    testing: function(){
        console.log(data);
    }
}
    
    })();

 


//UIcontroller module
var userController = (function (){
    
    var domStrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentage:'.budget__expenses--percentage',
        budget:'.budget__value',
        conatiner:'.container',
        expPercentageLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
    }
    
    var formatNumber = function(num, type){
         var splitNum,integer,decimal;
        num = Math.abs(num);
        num = num.toFixed(2);
        
        splitNum = num.split('.');
        
        integer = splitNum[0];
        decimal = splitNum[1];
        
        if(integer.length > 3){
            integer = integer.substr(0,integer.length-3)+','+ integer.substr(integer.length-3,3);
        }
        type === 'inc'?sign='+' :sign='-';
        
        return sign+' '+integer+'.'+decimal;
    };
    var nodeForEach = function(list,callback){
              for(var i=0;i<list.length;i++){
                  callback(list[i],i);
              }
          };
    
  return{
      
      getInput : function(){
          return{
              type: document.querySelector(domStrings.inputType).value,//gtes either increment or decrement
              description: document.querySelector(domStrings.inputDescription).value,
              value: parseFloat(document.querySelector(domStrings.inputValue).value)
          };
      },
      
      getDomStrings: function(){
          return domStrings;
      },
      
      addListItem: function(obj, type){
          var HTML,newHTML,elemet;
          //1.create HTML strings with placeholder text
          if (type === 'inc'){
              HTML='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
              
              elemet=domStrings.incomeContainer;
          }
          else if(type === 'exp'){
              HTML='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
              
              elemet=domStrings.expenseContainer;
          }
          //2.replace placeholder text with actual data.
          newHTML = HTML.replace('%id%',obj.id);
          newHTML = newHTML.replace('%description%',obj.description);
          newHTML = newHTML.replace('%value%',formatNumber(obj.value,type));
          //3.insert the HTML into the DOM.
          document.querySelector(elemet).insertAdjacentHTML('beforeend',newHTML);
      },
      
      clearFeilds: function(){
          var feilds;
          
          feilds = document.querySelectorAll(domStrings.inputDescription+','+domStrings.inputValue);
          //converting above list input to array.
          
          feildsArr = Array.prototype.slice.call(feilds);
          
          //clearig the input and desc from array uisng forEach() array method.
          
          feildsArr.forEach(function(current,index,array){
              current.value = '';
          });
          
          //adding focus to description input
          
          feildsArr[0].focus();
      },
      
      displayBudget: function(obj){
          var type;
          if(obj.budget > 0){type = 'inc'}else(type='exp')
          document.querySelector(domStrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
          document.querySelector(domStrings.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');
          document.querySelector(domStrings.budget).textContent=formatNumber(obj.budget,type);
          
          if(obj.percentage !== -1){
              document.querySelector(domStrings.percentage).textContent=obj.percentage+'%';
          
          }else{
              document.querySelector(domStrings.percentage).textContent='---';
          
          }
          
          
      },
      
      deleteListItem: function(listID){
          var el;
          
          el = document.getElementById(listID);
          
          el.parentNode.removeChild(el);
      },
      
      displayPercentage: function (percentages){
          var feilds;
          
          feilds = document.querySelectorAll(domStrings.expPercentageLabel);
          
          
          
         nodeForEach(feilds,function(current,index){
             if(percentages[index]>0){
            current.textContent = percentages[index]+'%';
                 
             }else{
                 current.textContent = '---';
             }
            
         });
          
          
      },
      
      displayDate : function(){
          var now,year,month,months,time;
          now = new Date();
          
          year = now.getFullYear();
          
          month = now.getMonth();
          
          months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
          
          document.querySelector(domStrings.dateLabel).textContent = months[month] +' '+ year;
          
      },
      
      changeDisplay : function(){
          var feilds;
           feilds=document.querySelectorAll(domStrings.inputType+','+domStrings.inputDescription+','+domStrings.inputValue);
          
          nodeForEach(feilds,function(curr){
              curr.classList.toggle('red-focus');
          });
          
          document.querySelector(domStrings.inputBtn).classList.toggle('red');
          
      }
      
          
      
      
      
      
      
  };
    
    
    
    
})();


//Global App module
var controller = (function (budgetCtrl,uiCtrl){
    
    var setUpeventListeners = function (){
        var DOM = uiCtrl.getDomStrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAdditem);
    
    
  document.addEventListener('keypress', function(event){
      if (event.keyCode === 13 || event.which === 13)
          {
             ctrlAdditem();
          }
  });
        document.querySelector(DOM.conatiner).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change',uiCtrl.changeDisplay);
        
    };
    var updatePercentages = function(){
      
        //1.calculate percentages
        budgetCtrl.calculatePercentage();
        
        //2.read percentages from budget controller
        var allPercentage=budgetCtrl.getPercentage();
        //3.update UI with new percentages
        uiCtrl.displayPercentage(allPercentage);
    };
    
    var updateBudget = function (){
        //1.calculate budget
        budgetCtrl.calculateBudget();
        
        //2.return budget
        var budget = budgetController.getBudget();
       
        //3.display budget in UI
        uiCtrl.displayBudget(budget);
    }
    
    var ctrlAdditem = function (){
         //1.get the input data
        var input,newItem;
        input = uiCtrl.getInput();
        
        if(input.description !=="" && !isNaN(input.value) && input.value >0){
            
        //2.add item to budget controller
        
        newItem = budgetController.addItems(input.type,input.description,input.value);
        
      
        //3.add item to user interface.
        uiCtrl.addListItem(newItem,input.type);
        
        //4.clear the input feilds(description and value)
        uiCtrl.clearFeilds();
      
        //5.calculate budget and display it
            updateBudget();
            
        //calculate and display percentages
            updatePercentages();
            
        }
        
       }
    
  
    var ctrlDeleteItem = function(event){
        var itemID,splitID,type,ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        
            
            
            //1.delete the item from our data structure
            budgetCtrl.deleteItem(type,ID);
            
            //2.delete item from our UI
            uiCtrl.deleteListItem(itemID);
            
            //3.update the budget again.
            updateBudget();
            
            //4.calculate and display percentages
            updatePercentages();  
          
            
            
            
            
        }
    };
    
    
    return{
        init: function(){
            console.log('it has begun');
            setUpeventListeners();
            uiCtrl.displayBudget({
            budget:0,
            totalInc:0,
            totalExp:0,
            percentage:-1
        });
            uiCtrl.displayDate();
          
        }
    }
    
    
    
    
    
    
})(budgetController,userController);






controller.init();






























