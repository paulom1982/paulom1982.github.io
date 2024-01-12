// -------------------------------------------------------------------------
// GENERAL FUNCTIONS
// -------------------------------------------------------------------------

// GET TRANSACTIONS LIST
function getTransactions() {
    // Get transaction list and load to table; 
    
    // USING THE SHEETDB METHOD.
    //    Will likely uste the SheetDB method instead since it supports enough requests for personal use and is much easier to use.  
    //    Using the Google API method below just to test an option that doesn't depend on a 3rd party such as SheetDB.
    $.getJSON('https://sheetdb.io/api/v1/n09q5n4vvki5y', function(myData) {
        // JSON result in `data` variable
        console.log(myData)
        myDataJson = JSON.stringify(myData);
        console.log(myDataJson);

        var table = new Tabulator("#transaction_table", {
            height:305, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
            data:myDataJson, //assign data to table
            //layout:"fitColumns", //fit columns to width of table (optional)
            columns:[ //Define Table Columns
            {title:"Transaction Date", field:"Transaction_Date", sorter:"date", hozAlign:"center"},
            {title:"Payee", field:"Payee"},
            {title:"Category", field:"Category_1"},
            {title:"Transaction Total", field:"Transaction_Total"}
            ],
        });
        
    });
    
    //Tabulator
    // var table = new Tabulator("#transaction_table", {
    //     ajaxURL:"https://sheetdb.io/api/v1/n09q5n4vvki5y", //ajax URL
    // });


    // TABULATOR SAMPLE:
    // var tabledata = [
    //   {id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
    //   {id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
    //   {id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
    //   {id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
    //   {id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
    // ];
    // //create Tabulator on DOM element with id "example-table"
    // var table = new Tabulator("#transaction_table", {
    //   height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    //   data:tabledata, //assign data to table
    //   layout:"fitColumns", //fit columns to width of table (optional)
    //   columns:[ //Define Table Columns
    //     {title:"Name", field:"name", width:150},
    //     {title:"Age", field:"age", hozAlign:"left", formatter:"progress"},
    //     {title:"Favourite Color", field:"col"},
    //     {title:"Date Of Birth", field:"dob", sorter:"date", hozAlign:"center"},
    //   ],
    // });

    // USING THE GOOGLE API METHOD.
    //    source: https://www.sitepoint.com/google-sheets-api-v4-integration-guide/
    //    source: https://chriszarate.github.io/sheetrock/#usage
    // var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1nl1hJd9mAbw4TFrErvpPvWiccrBesnnAtTl7JffK6B0/edit#gid=0';
    // $('#transaction_table').sheetrock({
    //   url: mySpreadsheet,
    //   query: "SELECT A,B,C,D,E,F,G WHERE C = 'Expense' ORDER BY B DESC",
    // }).on('sheetrock:loaded', function () {
    //   $(this).DataTable({responsive: true});
    // });

};