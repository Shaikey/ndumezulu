
/*code normalization*/

$(document).ready(function(){
	
	$.urlParam = function (name){
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.search);
		return (results !== null) ? results[1] || 0 : false;
	}
	
	$(function () {
		var item = $.urlParam('name');
		
		if(window.location.href == 'dashboard/home'){
			console.log('Invalid url...');
			//window.location.href = '/'
		}
		
		if(item == 'value3'){
			$('#spin-1').attr('href', 'images/360/gown-01/gown-01-01.png');
			$('#spin-1-thumb').attr('src', 'images/360/gown-01/gown-01-01.png');
		} else if(item == 'value5'){
			$('#spin-1').attr('href', 'images/360/hat-01/Hat-01-16.jpg');
			$('#spin-1-thumb').attr('src', 'images/360/hat-01/Hat-01-16.jpg');
		}
		
		//Calling products info: 
        $.ajax({
            url: '/item/' + $.urlParam('name'),
			type: 'Get',
            contentType: 'application/json',
            success: function (response) {
                var tbodyEl = $('#product-det');

                tbodyEl.html(response);
				tbodyEl.append('\
					<div class="alert alert-success hidden" role="alert"><i>Cart added successfully.</i><button type="button" class="close" data-dismiss="alert" aria-label="Close">\
							<span aria-hidden="true">×</span>\
						  </button>\
					</div>\
					<div class="dress-name"><h3>' + response.result[0].P_Name + '</h3><span>R' + response.result[0].P_Price + '</span><div class="clearfix"></div>\
						<p>' + response.result[0].P_Desc + '</p>\
					</div>\
					<div class="span span1">\
						<p class="left">FABRIC ORIGIN</p>\
						<p class="right">South Africa</p>\
						<div class="clearfix"></div>\
					</div>\
					<div class="span span2">\
						<p class="left">MADE IN</p>\
						<p class="right">Proudly South African</p>\
						<div class="clearfix"></div>\
					</div>\
					<div class="span span3">\
						<p class="left">COLOR</p>\
						<p class="right">' + response.result[0].P_Details[0].Color + '</p>\
						<div class="clearfix"></div>\
					</div>\
					<div class="span span4">\
						<p class="left">SIZE</p>\
						<p class="right"><span class="selection-box"><select class="domains valid" name="domains">\
										   <option>M</option>\
										   <option>L</option>\
										   <option>XL</option>\
										   <option>FS</option>\
										   <option>S</option>\
									   </select></span>\
						</p>\
						<div class="clearfix"></div>\
					</div>\
					<div class="purchase">\
						<div class="product-price">\
							<span>R' + response.result[0].P_Price + '</span>\
							<a href="" id="addCart" target="" class="cart-btn">Add to cart</a>\
						</div>\
						<div class="social-icons">\
							<ul>\
								<li><a class="facebook1" href="#"></a></li>\
								<li><a class="twitter1" href="#"></a></li>\
								<li><a class="googleplus1" href="#"></a></li>\
							</ul>\
						</div>\
						<div class="clearfix"></div>\
					</div>\
				');
            }
        });
		
		
		/* check if logged in */
		if($('.header-top-left ul li').hasClass('dropdown')){
			getProduct();
		} else {
			$('.simpleCart_total').text('R0.00');
			$('.simpleCart_quantity').text('0');
		}
	});
	
	$(document).on('click', '.list-group .list-group-item:nth-child(-n+3), .simpleCart_total', function(){
		var h = $(this);
		var vb = h.text();
		if(vb.indexOf('Orders') != -1){
			orderFunction();
		} else if(vb.indexOf('Inbox') != -1){
			inboxFunction();
		} else{
			cartFunction();
		}
		
		//Calling products info on cart: :nth-child(-n+3)
        $.ajax({
            url: '/all-products',
			type: 'Get',
            contentType: 'application/json',
            success: function (response) {
                var tbodyEl = $('.cart-gd');
				tbodyEl.html('');
				let products = [];
				var key = 0;
				var total = 0;
				
				if(localStorage.getItem('products')){
					products = JSON.parse(localStorage.getItem('products'));
					
					$.each(response, function(index, value){
						
						const exist = products.some(el => el.name === response[index].P_Name);
						if(exist){
							var cap = response[index].P_Price;
							total += parseFloat(cap) || 0;
							key++;
							tbodyEl.append('\
								<div class="cart-headerX">\
									<div class="close' + key + '"></div>\
									<div class="cart-sec simpleCart_shelfItem">\
										<div class="cart-item cyc">\
											<img src="images/index/' + response[index].P_Item + '.jpg" class="img-responsive" alt="">\
										</div>\
										<div class="cart-item-info">\
											<h3><a href="#">' + response[index].P_Name + '</a><span>' + response[index].P_Desc + '</span></h3>\
											<ul class="qty">\
												<li><p>Min. order value:</p></li>\
												<li><p>R ' + response[index].P_Price + '</p></li>\
											</ul>\
											<div class="delivery">\
												<p>Service Charges : $10.00</p>\
												<span>Delivered in 1-1:30 hours</span>\
												<div class="clearfix"></div>\
											</div>\
										</div>\
										<div class="clearfix">\
									</div>\
								</div>\
							');
						}
					});
					var totl = $('.modal-title-footer').text('Grand Total: R ' + total.toFixed(2));
					
				}
				
            }
        });
	});
	
	/* get selected item by group */
	$('.product-list li').on('click', function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		
		var df = $(this).text();
		var category = '';
		
		if(df == 'All'){
		category = '';
		} else if(df == 'T-shirts'){
			category = 'Shirt';
		} else if(df == 'Pants'){
			category = 'Trouser';
		} else if(df == 'Dresses'){
			category = 'Dress';
		} else if(df == 'Shorts'){
			category = 'Short';
		} else if(df == 'Suits'){
			category = 'Suit';
		} else {
			category = 'Hat';
		}
		
		//Calling products info on cart: :nth-child(-n+3)
		$.ajax({
			url: '/all-products/' + category ,
			type: 'Get',
			contentType: 'application/json',
			success: function (response) {
				var tbodyEl = $('.cbp-vm-switcher ul');
				tbodyEl.html('');
				
				$.each(response, function(index, value){
					tbodyEl.append('\
						<li><a class="cbp-vm-image" href="item?name=' + value.P_Item + '">\
							<div class="simpleCart_shelfItem">\
								<div class="view view-first">\
									<div class="inner_content clearfix">\
										<div class="product_image">\
											<img src="images/index/' + value.P_Item + '.jpg" class="img-responsive" alt=""/>\
											<div class="mask"><div class="info">Quick View</div></div>\
											<div class="product_container"><div class="cart-left">\
												 <p class="title">' + value.P_Name + '</p></div>\
											   <div class="pricey"><span class="item_price">R' + value.P_Price + '</span></div>\
											   <div class="clearfix"></div>\
											</div></div>\
								</div></div>\
								</a><div class="cbp-vm-details">' + value.P_Desc + '</div>\
							</div>\
						</li>\
					');
				});
			}
		});
		
	});
	
	// remove item from cart
	$(document).on('click', '.close1, .close2, .close3, .close4, .close5', function(c) {
		var df = $(this).parent();
		df.fadeOut('slow', function(c){
			df.remove();
		});
		var name = df.find('a').text();
		removeProduct(name);
	});
	
	// empty cart
	$(document).on('click', '.simpleCart_empty', function() {		
		removeProduct('all-items');
	});
	
	
			
	// dropdown role
	$('.input-group-btn .dropdown-menu li').on('click', function() {
	  var $dropdown = $('.input-group-btn .dropdown-toggle');
	  var text = $(this).text();
	  var $span = $dropdown.find('span');
	  
	  $dropdown.text(text);
	  
	  if(text === 'System'){
		  $('#search-theme-form').attr('action', '/dashboard/home');
	  } else{
		  $('#search-theme-form').attr('action', '/login');
	  }
	});
	
	//$('#passLog').onchange(function () {
	//$(document).on('change', '#passLog', function(e) {
	$('#passLog').on('input',function(e){
		var mail = $('#passLog').val();
		var idDpt = 'Admin';
		var $dropdown = $('.input-group-btn .dropdown-toggle');
		var $span = $dropdown.find('span');
		
		var text = "Default";
		$dropdown.text(text);
		$('#search-theme-form').attr('action', '/login');
		//Calling user info: 
        $.ajax({
            url: '/all-data/role/' + mail,
			type: 'Get',
            contentType: 'application/json',
            success: function (response) {
                
				if(response.C_Role.Name == idDpt){
					var text = "Admin";
					$dropdown.text(text);
					$('#search-theme-form').attr('action', '/dashboard/home');
				} else{
					$dropdown.text(text);
					$('#search-theme-form').attr('action', '/login');
				}
			}
        });
	});
	
	$('#search-theme-form').on('click', function(){
		
	});
	
	// + 2 cart 
	$(document).on('click', '#addCart', function(e) {
		e.stopImmediatePropagation();
		e.preventDefault();
		
		/* Add then get */
		if($('.header-top-left ul li').hasClass('dropdown')){
			addProduct();
		} else {
			var ghj = $('.dress-info .alert').removeClass('hidden');
			$('.dress-info .alert').removeClass('alert-success').addClass('alert-danger');
			$('.dress-info .alert i').text('You must login 1st before adding to cart.')
		}
	});
	
	$(document).on('click', '.box_1 a h3 span.simpleCart_totalZ', function() {
		cartFunction();

	});
	
	function getProduct(){
		const cc = localStorage.getItem('products');
		var total = 0;
		var newTot = 0;
		if(cc != null){
			$.each(JSON.parse(cc), function(index, value){
				var cap = value.price.slice(1);
				var nam = value.name.replace(/\W+/g, '_').toLowerCase();
				if(nam){
					total += parseFloat(cap) || 0;
					newTot++;
				}
			});
		}	
		var totals = $('.simpleCart_total').text('R' + total.toFixed(2));
		var totl = $('.modal-title-footer').text('Grand Total: R ' + total.toFixed(2));
		var quantity = $('.simpleCart_quantity').text(newTot);
		
	}
	
	function addProduct(){
		let products = [];
		var priceP = $('.product-price span').text();
		var nameP = $('.dress-name h3').text();
		
		if(localStorage.getItem('products')){
			products = JSON.parse(localStorage.getItem('products'));
		}
		
		const exist = products.some(el => el.name === nameP);
		if(!exist){
			products.push({'price': priceP, 'name': nameP});
			var ghj = $('.dress-info .alert').removeClass('hidden');
			$('.dress-info .alert').removeClass('alert-danger').addClass('alert-success');
			$('.dress-info .alert i').text('Cart added successfully.')
		} else{
			var ghj = $('.dress-info .alert').removeClass('hidden');
			$('.dress-info .alert').removeClass('alert-success').addClass('alert-danger');
			$('.dress-info .alert i').text('Cart already added.')
		}
		localStorage.setItem('products', JSON.stringify(products));
		
		
		getProduct();
	}
	
	function removeProduct(name){
		// some logic
		// store in local storage
		
		let storageProd = JSON.parse(localStorage.getItem('products'));
		if(name !== 'all-items'){
			let products = storageProd.filter(product => product.name !== name);
			localStorage.setItem('products', JSON.stringify(products));
		} else{
			localStorage.clear();
		}
		
		getProduct();
	}
	
	function cartFunction(){
		$('#profile-tab').click();
	}
	
	function inboxFunction(){
		$('#dropdown1-tab').click();
	}
	
	function orderFunction(){
		$('#home-tab').click();
	}
	
});



