
// Prepare the transactions form
transactionFormDefaults();

$("#btn_cancel_transaction").click(function(){
    //$("#container_form_transaction").slideUp("slow");
    $("#form_transaction").hide("slide", { direction: "down" }, 500);
  });

// -------------------------------------------------------------------------
// GENERAL FUNCTIONS
// -------------------------------------------------------------------------

// PREPARE TRANSACTION FORM
function transactionFormDefaults() {
                  
    // Initialize all select pickers
    $(".selectpicker").selectpicker();

    // Set the currency input AND the expense/income selector colors
    $(".js-format-currency").css("color", "red");

    // TRANSACTION ID auto-populate
    $("#transaction_id").val( moment().format('YYYYMMDDHHmmssSSS') );

    // TRANSACTION DATE auto-populate
    $('#transaction_date').attr("value", moment().format('YYYY-MM-DD') );

    // TRANSACTION TOTAL label & hidden number box
    $("#amount_total_view_only").text( "Total:  $0.00" );
    $("#amount_total_numeric_format").val(0.00);

    // Set focus on first transaction amount input
    document.getElementById("payee").focus();

    console.log("form reset");
    
};

// ---------------------------------------------------------------------------------------------------
// SPECIAL FUNCTIONS 
// ---------------------------------------------------------------------------------------------------

// Currency Input Visualizer
var inputs = document.getElementsByClassName("js-format-currency");
for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('input', function (e) {
        var input = e.target.value.replace(/[^0-9]/g, '');                                  // Remove non-digits
        var formatted = parseFloat(input / 100).toFixed(2);                                 // Divide by 100 and fix to 2 decimal places
        formatted = Number(formatted).toLocaleString('en-US', {minimumFractionDigits: 2});  // Add commas
        e.target.value = formatted;
    });
}
// Remove any commas from number, for number to be valid for calculations
function cleanNumber(str) {
    return parseFloat(str.replaceAll(',', ''));
};

// Datepicker, popup calendar for the form
$(".form_date").datepicker({
    weekStart: 0,
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 0,
    minView: 2,
    daysOfWeekHighlighted: [0, 6],
    disableTouchKeyboard: true,
    forceParse: 0
});

    

// ---------------------------------------------------------------------------------------------------
// CONTROLS EVENT HANDLERS
// ---------------------------------------------------------------------------------------------------

// TRANSACTION TYPE
$("input[type=radio][id=transaction_type]").change(function(){               // "input change click touchend" = all added for iOS "keyup" support
    var transaction_type = $("input[type=radio][id=transaction_type]:checked").val();
    if (transaction_type == "Expense") {
        // If expense, change text colors to red, otherwise green/black
        $(".js-format-currency").css("color", "red");
        $("#transaction_type_container").addClass("bg-danger").removeClass("bg-success");
        $("#transaction_type_indicator").css( "background", "radial-gradient(ellipse at 50% 0%, hsla(0, 100%, 39%, 0.43) 70%, transparent 70%)" );
        $("body").css( "background", "linear-gradient(to bottom, hsla(0, 100%, 39%, 0.43) 0%,#ffd9d6 100%)" );
    } else {
        $(".js-format-currency").css("color", "black");
        $("#transaction_type_container").addClass("bg-success").removeClass("bg-danger");
        $("#transaction_type_indicator").css( "background", "radial-gradient(ellipse at 50% 0%, hsla(115, 100%, 37%, 0.26) 70%, transparent 70%)" );
        $("body").css( "background", "linear-gradient(to bottom, hsla(115, 100%, 37%, 0.26) 0%,#d6ffdc 100%)" );
    }
});

// CATEGORY TYPE AUTO-SELECT
$("#payee, #amount_total_numeric_format").on("keyup change paste", function(e){ 
    var total_amount = $("#amount_total_numeric_format").val();
    
    // PAYEE
    switch( $("#payee").val() ) {
        
        case "Shoprite":
        $("#category_1").val('Groceries');
        $("#payment_type").val('Debit: Groceries');
        break;
        case "Wawa":
        if(total_amount >= 20) {
            $("#category_1").val("Gasoline");
        } else if(total_amount > 0 && total_amount < 20) {
            $("#category_1").val("Snacks/Coffee");
        } else {
            $("#category_1").val("");
        }
        break;
        default:
        $("#category_1").val("");
        $("#payment_type").val('Debit: Pay');
        
    }
    
    $(".selectpicker").selectpicker('refresh')
});

// SPLIT TRANSACTION
$("#split").click(function(){
    $("#split_amounts").toggle();
    if($(this).prop('checked')==false) {
        $(this).val("N");
        $("#amount_2, #amount_3").val('');
        $("#category_2, #category_3").val('');
    } else {
        $(this).val("Y");
    }
});

// AMOUNTS AND SPLIT TRANSACTION EVENT CHANGES
$("#amount_1, #amount_2, #amount_3, #split").on("keyup input change paste click touchend", function(e){         // "input change click touchend" = all added for iOS "keyup" support
    var amount_1_number = parseFloat( $("#amount_1").val() == "" ? 0.00 : cleanNumber($("#amount_1").val()) );  // cleanNumber is a custom function which removes the commas from numbers
    var amount_2_number = parseFloat( $("#amount_2").val() == "" ? 0.00 : cleanNumber($("#amount_2").val()) );
    var amount_3_number = parseFloat( $("#amount_3").val() == "" ? 0.00 : cleanNumber($("#amount_3").val()) );
    
    // First, set the hidden numeric box first; value here is used for rules in other controls
    var amount_total_formatted = parseFloat(amount_1_number + amount_2_number + amount_3_number).toFixed(2)
    $("#amount_total_numeric_format").val( amount_total_formatted ).trigger("input"); // Need to trigger input so that the CATEGORY TYPE AUTO-SELECT event above will detect the change.
    // Then, set the visible, formatted label for the end user to view
    amount_total_formatted = Number(amount_total_formatted).toLocaleString('en-US', {minimumFractionDigits: 2}); // add commas to the display number
    $("#amount_total_view_only").text( "Total:  $" + amount_total_formatted );
});

// CLEARED
$("#cleared").click(function(){
    if($(this).prop('checked')==false){
        $(this).val("N");
    } else {
        $(this).val("Y");
    }
});


// ---------------------------------------------------------------------------------------
// FORM SUBMISSION
// ---------------------------------------------------------------------------------------
// Form variable
var form = document.getElementById("form_transaction");

form.addEventListener("submit", e => {
    
    // Will prevent the form submission from continuing if a "return false" is present
    e.preventDefault();
    
    // VALIDATIONS START ----------------------------------------------------
    var total_amount = $("#amount_total_numeric_format").val();
    if(total_amount == "" || total_amount == 0){
        alert("You haven't entered in a transaction amount.");
        return false;
    }
    // VALIDATIONS END ----------------------------------------------------
    
    
    // Show loading spinner
    $('#overlay').fadeIn();
    
    transaction_type = $("input[type=radio][id=transaction_type]:checked").val();
    amount_1 = $("#amount_1").val();
    amount_2 = $("#amount_2").val();
    amount_3 = $("#amount_3").val();
    
    if (transaction_type == "Expense") {
        // If expense, convert amounts to negative numbers
        if(amount_1 !="") { $("#amount_1").val(-amount_1) };
        if(amount_2 !="") { $("#amount_2").val(-amount_2) };
        if(amount_3 !="") { $("#amount_3").val(-amount_3) };
    } 
    e.preventDefault();
    fetch(form.action, {
        method : "POST",
        body: new FormData(document.getElementById("form_transaction")),
    }).then(
        response => response.json()
    ).then((html) => {
        // Reset the form 
        $("#form_transaction").trigger("reset");
        $("#split").prop("checked", false)
        $("#split_amounts").hide();

        // Set page defaults
        transactionFormDefaults();
        
        // Hide loading spinner
        $('#overlay').fadeOut();

        // Display confirmation
        $("#pop_up_dialog").modal("toggle");
    });

    
});

