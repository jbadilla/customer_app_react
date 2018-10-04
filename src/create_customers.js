
var curr_product_id = 0;
var product_ids = [0]
var products = {0:{'value-driver': '', 'attribute': ''}}
var products_by_category = {'none': [0]};
var correlation_matrix = []
var curr_bundle_id = 0
var bundles = {}
var sales_volumes = {};
var curr_sales_id = 0;


/* <------------------------------------------------- Helper Functions Code -------------------------------------------------> */

function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/* <------------------------------------------------- Products Code -------------------------------------------------> */

$('#add-product').click(function(){
    curr_product_id +=1
    var html =  `<tr id="product_${curr_product_id}">
                    <td><input id="value-driver_${curr_product_id}" type="text" class="form-control form-control-sm" placeholder="Enter value driver"></td>
                    <td><input id="attribute_${curr_product_id}" type="text" class="form-control form-control-sm" placeholder="Enter attribute" required></td>
                    <td><input type="number" class="form-control form-control-sm" placeholder="0" value="0" required></td>
                    <td><input type="number" class="form-control form-control-sm" placeholder="0" value="-2" required></td>
                    <td><i class="material-icons delete-product">delete_outline</i></td>
                </tr>`;
    $('#products_table').append(html);
    $('.bundle-price').each(function(){
        console.log('adding product to bundle');
        var bundle_id = $(this).closest('div[id^="bundle_"').attr('id').split('_')[1];
        var switch_id = bundle_id + '_' + curr_product_id.toString();
        html = `<div class="form-group inline row product">
                    <div class="col-12">
                        <div class="form-group inline row">
                            <div class="col-8 bundle-product">
                                <label class="col-form-label text-sm-left bundle-product_${curr_product_id}"></label>
                            </div>
                            <div class="col-4">
                                <div class="switch-button switch-button-xs switch-button-yesno">
                                    <input type="checkbox"  id="${switch_id}"><span>
                                    <label for="${switch_id}"></label></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        $(this).before(html);
    });
    
    product_ids.push(curr_product_id);
    products[curr_product_id] = {'value-driver': '', 'attribute': ''}
    if ('none' in products_by_category){
        products_by_category['none'].push(curr_product_id);
    } else products_by_category['none'] = [curr_product_id];
    correlation_matrix.push([]);
    updateCorrelationTable();
});

$(document).on("click", ".delete-product", function(){
    var id = parseInt($(this).parent().parent().attr('id').split('_')[1]);
    var index = product_ids.indexOf(id);
    if (index != correlation_matrix.length) correlation_matrix.splice(index,1);
    else correlation_matrix.splice(index-1,1);
    if(index !=0){
        for (var i=0; i <correlation_matrix.length; i++){
            correlation_matrix[i].splice(index-1,1);
        }
    } else {
        for (var i=0; i <correlation_matrix.length; i++){
            correlation_matrix[i].splice(index,1);
        }
    }
    var remove_category = false;
    product_ids.splice(index, 1);
    var value_driver = products[id]['value-driver'].toLowerCase();
    if (value_driver == '') value_driver = 'none';
    index = products_by_category[value_driver].indexOf(id);
    products_by_category[value_driver].splice(index, 1)
    if (products_by_category[value_driver].length == 0 && value_driver != 'none'){
        delete products_by_category[value_driver];
        remove_category = true;
    }
    delete products[id];

    $(this).parent().parent().remove();
    $('.bundle-product_'+id).each(function(){
        if(remove_category) $(this).closest('.bundle-category').remove();
        else{
            if($(this).is(':selected')){
                console.log(this, 'is selected');
                console.log($(this).closest('.bundle-category').find('.bundle-category-value'));
                $(this).closest('.bundle-category').find('.bundle-category-value').html(products[products_by_category[value_driver][0]]['attribute'] + ' <i class="material-icons">arrow_drop_down</i>');
            }
            $(this).closest('.product').remove();
        }
    });
    updateCorrelationTable();
});

$(document).on('input', 'input[id^="value-driver_"]', function(){
    var id = parseInt(this.id.split('_')[1]);
    var value_driver = this.value.toLowerCase();
    var product = this.value + ': ' + $('#attribute_'+id).val();
    products[id]['value-driver'] = this.value;
    if (value_driver == 'none' || value_driver == '') product = $('#attribute_'+id).val();
    $('#corr-head_'+id).html('<strong>'+product+'</strong>');
    $('#corr-row_'+id).html(product);
   
    if (value_driver == '') value_driver = 'none';
    var prev_cat_empty = false;
    var prev_cat = '';
    for (var cat in products_by_category){
        var index = products_by_category[cat].indexOf(id);
        if (index != -1){
            prev_cat = cat;
            products_by_category[cat].splice(index,1);
            if(products_by_category[cat].length == 0){
                delete products_by_category[cat];
                prev_cat_empty = true;
            }
            break;
        }
    }
    $('.bundle-product_'+id).each(function(){
        if($(this).hasClass('product')){
            // $(this).html($('#attribute_'+id).val());
            if($(this).is(':selected') && !prev_cat_empty){
                console.log('changing selected');
                var index = products_by_category[prev_cat].indexOf(id);
                index = index != 0? 0: 1;
                var attribute = products[products_by_category[prev_cat][index]]['attribute'];
                $(this).closest('.bundle-category').find('.bundle-category-value').html(attribute + ' <i class="material-icons">arrow_drop_down</i>');
            }
        } else {
            $(this).html(product);
        }
    });
    $('.bundle-product_'+id).each(function(){
        if(prev_cat_empty && prev_cat != 'none') $(this).closest('.bundle-category').remove();
        else $(this).closest('.product').remove();
    });
    console.log(products);
    if (value_driver == 'none'){
        $('.bundle-price').each(function(){
            console.log('adding product to bundle');
            var bundle_id = $(this).closest('div[id^="bundle_"').attr('id').split('_')[1];
            var switch_id = bundle_id + '_' + id.toString();
            html = `<div class="form-group inline row product">
                        <div class="col-12">
                            <div class="form-group inline row">
                                <div class="col-8 bundle-product">
                                    <label class="col-form-label text-sm-left bundle-product_${id}">${products[id]['attribute']}</label>
                                </div>
                                <div class="col-4">
                                    <div class="switch-button switch-button-xs switch-button-yesno">
                                        <input type="checkbox" id="${switch_id}"><span>
                                        <label for="${switch_id}"></label></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            $(this).before(html);
        });
    } else {
        if (value_driver in products_by_category){
            $('.bundle-dropdown_'+value_driver).each(function(){
                $(this).append(`<option class="product bundle-product_${id}" value="${id}">${products[id]['attribute']}</option>`);
            });
        } else {
            $('.bundle-price').each(function(){
                var bundle_id = $(this).closest('div[id^="bundle_"').attr('id').split('_')[1];
                var Value_driver = capitalizeFirstLetter(value_driver);
                var switch_id = 'category-switch_' + bundle_id + '_' + value_driver;
                html = `<div class="form-group inline row bundle-category">
                            <div class="col-8">
                                <label id="bundle-category_${value_driver}">${Value_driver}</label><br>
                                <label class="bundle-category-value">${products[id]['attribute']}  <i class="material-icons">arrow_drop_down</i></label>
                                <select class="bundle-dropdown_${value_driver} form-control custom-select bundle-category-select" dir="rtl">              
                                    <option class="product bundle-product_${id}" value="${id}">${products[id]['attribute']}</option>
                                </select>
                            </div>
                            <div class="col-4">
                                <div class="switch-button switch-button-xs switch-button-yesno switch-cat">
                                    <input type="checkbox" id="${switch_id}"><span>
                                    <label for="${switch_id}"></label></span>
                                </div>
                            </div>
                        </div>`;
                $(this).before(html);
            });
        }
    }
    if (value_driver in products_by_category){
        products_by_category[value_driver].push(id);
    } else {
        products_by_category[value_driver] = [id];
    }
    console.log(products_by_category);
});


// $(document).on('change', 'input[id^="value-driver_"]', function(){


// });

$(document).on('input', 'input[id^="attribute_"]', function(){
    var id = parseInt(this.id.split('_')[1]);
    var value_driver = $('#value-driver_'+id).val().toLowerCase();
    var attribute = this.value;
    var product = $('#value-driver_'+id).val() + ': ' + this.value;
    products[id]['attribute'] = this.value;
    if (value_driver == 'none' || value_driver == '') product = $('#attribute_'+id).val();
    $('#corr-head_'+id).html('<strong>'+product+'</strong>');
    $('#corr-row_'+id).html(product);
    $('.bundle-product_'+id).each(function(){
        if($(this).hasClass('product')){
            $(this).html(attribute);
            if($(this).is(':selected')){
                console.log(product, 'is selected');
                console.log($(this).closest('.bundle-category').find('.bundle-category-value'));
                $(this).closest('.bundle-category').find('.bundle-category-value').html(attribute + ' <i class="material-icons">arrow_drop_down</i>');
            }
        } else {
            $(this).html(product);
        }
    });
    if (value_driver == ''){
        if ('none' in products_by_category){
            var index = products_by_category['none'].indexOf(id);
            if (index == -1){
                products_by_category['none'].push(id);
            }
        } else {
            products_by_category['none'] = [id];
        }
    }
    console.log(products_by_category);
});


/* <------------------------------------------------- Correlations Code -------------------------------------------------> */

$(document).on('change', 'input[id^="corr-wtp_"]', function(){
    var p = this.id.split('_')[1];
    var i = this.id.split('_')[2];
    correlation_matrix[p][i] = parseFloat(this.value);
});

function updateCorrelationTable(){
    var num_products = product_ids.length
    var headers = '';
    var rows = '';
    for (var p = 0; p < num_products -1; p++){
        var curr_id = product_ids[p];
        var next_id = product_ids[p+1];
        var value_driver = products[curr_id]['value-driver'].toLowerCase();
        var current = products[curr_id]['value-driver'] + ': ' + products[curr_id]['attribute'];
        if(value_driver == 'none' || value_driver == '') current = products[curr_id]['attribute'];
        value_driver =  products[next_id]['value-driver'].toLowerCase();
        var next = products[next_id]['value-driver'] + ': ' + products[next_id]['attribute'];
        if(value_driver == 'none' || value_driver == '') next = products[next_id]['attribute'];
        if (next == ': ') next = ' ';
        headers += '<th class="centered" id="corr-head_' + next_id + '"><strong>' + next + '</strong></th>'
        var row = '<tr><td id="corr-row_' + curr_id + '">' + current + '</td>';
        for (var i = 0; i < num_products-1; i++){
            row += '<td>'
            if(i >= correlation_matrix[p].length) correlation_matrix[p].push(null);
            if(i - p >= 0){
                var value = (correlation_matrix[p][i] == null)? 0: correlation_matrix[p][i];
                row += '<input id="corr-wtp_'+p+'_'+i+'" type="number" placeholder="0" class="form-control form-control-sm" value="'+ value +'" required>';
            }
            row += '</td>'
        }
        row += '</tr>'
        rows += row;
    }

    var html = `<table id="correlation_table" class="table table-fw-widget">
        <thead>
            <tr>
                <th></th>
                ` + headers + `
            </tr>
        </thead>
        <tbody id="correlation_rows">
            ` + rows + `
        </tbody>
    </table>`;
    $('#correlation_table').html(html);
    if (num_products>1) $('#correlation_container').css('display', 'table');
    else $('#correlation_container').css('display', 'none');
}

/* <------------------------------------------------- Bundles Code -------------------------------------------------> */

function add_bundle(name, price){
    var bundle_name = name === undefined? 'Enter Name': name;
    var bundle_price = price === undefined? '': price;
    var html = `<div class="col-sm-6 col-lg-4 bundle" id="bundle_${curr_bundle_id}">
                    <div class="form-group inline row"> 
                        <div class="col-12">
                            <label class="bundle-name">${bundle_name}</label>
                            <input type="text" placeholder="Enter name" class="form-control form-control-sm bundle-name-input">
                            <label class="float-right delete-bundle"><i class="material-icons">delete</i></label>
                        </div>
                    </div>
                    <div class="form-group inline row">
                        <div class="col-12 bundle-header">
                            <div class="form-group inline row">
                                <div class="col-8">
                                    <label class="col-form-label text-sm-left">Product</label>
                                </div>
                                <div class="col-4">
                                    <label class="col-form-label text-sm-left">Included</label>
                                </div>
                            </div>
                        </div>
                    </div>`
    for (cat in products_by_category){
        if (cat != 'none'){
            var Cat = capitalizeFirstLetter(cat);
            html += `<div class="form-group inline row bundle-category">
                        <div class="col-8">
                            <label id="bundle-category_${cat}">${Cat}</label><br>
                            <label class="bundle-category-value">${products[products_by_category[cat][0]]['attribute']}  <i class="material-icons">arrow_drop_down</i></label>
                            <select class="bundle-dropdown_${cat} form-control custom-select bundle-category-select" dir="rtl">`;                  
            for (var i in products_by_category[cat]){
                var p = products_by_category[cat][i];
                html += `<option class="product bundle-product_${p}" value="${p}">${products[p]['attribute']}</option>`
            }
            var switch_id = 'category-switch_' + curr_bundle_id + '_' + cat;
            html += ` </select></div>
                            <div class="col-4">
                                <div class="switch-button switch-button-xs switch-button-yesno switch-cat">
                                    <input type="checkbox" id="${switch_id}"><span>
                                    <label for="${switch_id}"></label></span>
                                </div>
                            </div>
                        </div>`;
        }
    }
    for (var i in products_by_category['none']){
        var p = products_by_category['none'][i];
        var switch_id = curr_bundle_id.toString() + '_' + p.toString();
        var product = products[p]['attribute'];
        html += `<div class="form-group inline row product">
                    <div class="col-12" >
                        <div class="form-group inline row">
                            <div class="col-8 bundle-product">
                                <label class="col-form-label text-sm-left bundle-product_${p}">${product}</label>
                            </div>
                            <div class="col-4">
                                <div class="switch-button switch-button-xs switch-button-yesno">
                                    <input type="checkbox" id="${switch_id}"><span>
                                    <label for="${switch_id}"></label></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    html += `<div class="form-group inline row bundle-price">
                <label class="col-4 col-form-label text-sm-left">Price<sup class="required"></sup></label>
                <div class="col-8">
                    <input type="number" placeholder="0.00" class="form-control form-control-sm" value="${bundle_price}" required>
                </div>
            </div>
        </div>`;
    bundles[curr_bundle_id] = 'Enter name';
    $('#bundles').append(html);
    $('#sales_header').append(`<th id="sales-bundle_${curr_bundle_id}"><strong>${bundle_name}</strong></th>`);
    $('.delete-sales').each(function(){
        var sales_id = $(this).attr('id').split('_')[1];
        var html = `<td><input id="sales_${sales_id}_${curr_bundle_id}" type="number" class="form-control form-control-sm" placeholder="Enter sales" value="0" required></td>`;
        $(this).parent().before(html);
    });
    
    curr_bundle_id+=1;
}


$(document).on('click', '#add-bundle', function(){
    add_bundle();
});

$(document).on('click', '.bundle-name', function () {
    var parent = $(this).parent().parent();
    parent.find('.bundle-name').hide();
    parent.find('.bundle-name-input').show().focus();
});

$(document).on('focusout', '.bundle-name-input', function() {
    var parent = $(this).parent();
    $(this).hide();
    parent.find('.bundle-name').html(this.value);
    parent.find('.bundle-name').show();
    var bundle_id = parent.parent().parent().attr('id').split('_')[1];
    $('#sales-bundle_'+bundle_id).html('<strong>'+this.value+'</strong>');
});

$(document).on('click', '.delete-bundle', function() {
    var bundle = $(this).closest('.bundle');
    var id = parseInt(bundle.attr('id').split('_')[1]);
    delete bundles[id];
    bundle.remove();

    var index = $('#sales-bundle_'+id).index();
    $('#sales_table tr').find('td:eq('+index+'), th:eq('+index+')').remove();
});

$(document).on('click','.bundle-category-value', function () {
    var parent = $(this).parent().parent();
    $(this).hide();
    parent.find('.bundle-category-select').show().focus();
    var max_size = parent.find('.bundle-category-select')[0].childElementCount >5? 5 : parent.find('.bundle-category-select')[0].childElementCount;
    parent.find('.bundle-category-select').attr('size', max_size)
});

$(document).on('focusout', '.bundle-category-select', function() {
    var parent = $(this).parent();
    $(this).hide();
    parent.find('.bundle-category-value').show();
});

$(document).on('change', '.bundle-category-select', function(){
    var parent = $(this).parent();
    $(this).hide();
    var value = parent.find('.bundle-category-value');
    value.html($(this).find('option:selected').text() + ' <i class="material-icons">arrow_drop_down</i>');
    value.show();
});

/* <------------------------------------------------- Sales Code -------------------------------------------------> */

function add_sales(period, store, volumes){
    var sales_period = period === undefined? '' : period;
    var store_name = store === undefined? '': store;
    // var sales_period = $('#sales-table tbody tr').length;
    var html = `<tr id="sales_${curr_sales_id}">
                <td>${store_name}</td><td>${sales_period}</td>`;
    // sales_volumes[curr_sales_id] = [];
    var i = 0;
    for(b in bundles){
        // sales_volumes[curr_sales_id].push(0);
        var sales = 0;
        if (volumes !== undefined){
            sales = volumes[i] === undefined? '': volumes[i];
        }
        html += `<td><input id="sales_${curr_sales_id}_${b}" type="number" class="form-control form-control-sm" placeholder="Enter sales" value="${sales}" required></td>`; 
        i++;
    }
    html += `<td><i class="material-icons delete-sales" id="delete-sales_${curr_sales_id}">delete_outline</i></td>
             </tr>`;
    $('#sales_rows').append(html);
    curr_sales_id += 1;
}

$('#add-sales').click(function(){
    add_sales();
});

$(document).on('click', '.delete-sales', function(){
    var sales_id = $(this).attr('id').split('_')[1];
    delete sales_volumes[sales_id];
    $(this).parent().parent().remove();
});

/* <------------------------------------------------- Excel Upload Code -------------------------------------------------> */

$('#excel-upload').change(function(){
    var form = $('#excel-form')[0];
    var values = new FormData(form);
    
    $.ajax({
        url: "http://127.0.0.1:5000/excel_upload",
        type: 'POST',
        contentType: false,
        processData: false,
        dataType: "json",
        data: values,
        success: function(response) {
            console.log(response);
            //add empty bundles
            var bundle_names = {}
            for (period in response){
                for (store in response[period]){
                    for (bundle in response[period][store]){     
                        if(!(bundle in bundle_names)){
                            bundle_names[bundle] = true;
                            var price = parseFloat(response[period][store][bundle]['price']).toFixed(2);
                            console.log(price);
                            add_bundle(bundle, price);
                        }
                    }
                }
            }
            for (period in response){
                for (store in response[period]){
                    var sales = []
                    for (bundle in bundle_names){     
                        if(bundle in response[period][store]){
                            sales.push(response[period][store][bundle]['sales'])
                        } else{
                            sales.push(0);
                        }
                    }
                    add_sales(period, store, sales)
                    first = false;
                }
            }
        },
        error: function(xhr) {
            alert(xhr);
        }
    });
});

/* <------------------------------------------------- Submit Code -------------------------------------------------> */

$('#customer-form').submit(function(event){
    event.preventDefault();
    var products = [];
    var product_wtps = [];
    var elasticities = [];
    $("#products_table tr").each(function(i, v){
        products.push({"category": $(this).find('td:eq(0) input').val(), "name": $(this).find('td:eq(1) input').val()});
        product_wtps.push(parseFloat($(this).find('td:eq(2) input').val()));
        elasticities.push(parseFloat($(this).find('td:eq(3) input').val()));
    });
    console.log('products', products);
    console.log('wtps',product_wtps);
    var correlations = [];
    for(var i=0; i < correlation_matrix.length; i++){
        for(var j=i; j< correlation_matrix[i].length; j++){
            correlations.push(correlation_matrix[i][j]);
        }
    }
    console.log('corr matrix', correlation_matrix);
    var bundle_cboxes = [];
    var price_points = [];
    $(".bundle").each(function(){
        var cbox = Array.apply(null, Array(products.length)).map(Number.prototype.valueOf,0);
        $(this).find('.bundle-category-select').each(function(){
            var category_switch = $(this).parent().parent().find('input[type="checkbox"]')[0];
            console.log(category_switch);
            if (category_switch.checked == true){
                console.log('setting true');
                var index = product_ids.indexOf(parseInt(this.value));
                cbox[index] = 1;
            }
            
        });
        $(this).find('.switch-button').each(function(){
            if (!$(this).hasClass("switch-cat")){
                var checkbox = $(this).find('input[type="checkbox"]')[0];
                var index = product_ids.indexOf(parseInt(checkbox.id.split('_')[1]));
                var value = checkbox.checked == true? 1: 0;
                cbox[index] = value;
            }
        });
        bundle_cboxes.push(cbox);
        var price = $(this).find('.bundle-price').find('input[type="number"]');
        price_points.push(parseInt(price[0].value))
    });
    console.log('cboxes', bundle_cboxes);
    console.log('price points', price_points);
    var sales_volumes = [];
    var total_sales_volumes = [];
    $("#sales_rows tr").each(function(i, v){
        var sales = [];
        $(this).find('input[type="number"]').each(function(i,v){
            sales.push(parseFloat(this.value));
        });
        sales_volumes.push(sales);
        total_sales_volumes.push(sales.reduce((a,b) => a + b, 0));
    });
    console.log('sales volumes', sales_volumes);
    console.log('total sales volumes', total_sales_volumes);
    var setup ={
        'bundle_cbox': bundle_cboxes,
        'customers_number': parseInt($('#customers_number').val()),
        'customers_number_real': parseInt($('#market_size').val()),
        'demand_function': $('#demand_function').val(),
        'factors': [],
        'N': parseInt($('#p-value').val()),
        'price_points': price_points,
        'start_corrs': correlations,
        'start_elas': elasticities,
        'start_market_size_all': total_sales_volumes,
        'start_wtps': product_wtps,
        'volumes_real_all': sales_volumes
    }

    $.ajax({
        url: "http://127.0.0.1:5001/api/customers/fit",
        type: 'POST',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            description: $('#description').val(),
            name: $('#name').val(),
            customers_number: parseInt($('#customers_number').val()),
            origin: 'Admin',
            products: products,
            product_wtps: product_wtps,
            setup: setup
        }),
        success: function(response) {
            console.log(response);
            
        },
        error: function(xhr) {
            alert(xhr);
        }
    });
});

$(document).ajaxStart(function(){
    $('#loader').css("display", "block");
});
$(document).ajaxComplete(function(){
    $('#loader').css("display", "none");
});