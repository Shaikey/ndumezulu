
/*code normalization*/

$(document).ready(function(){
	
	$.urlParam = function (name){
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.search);
		return (results !== null) ? results[1] || 0 : false;
	}
	
	// min details
	$('.content_box').find('p').each(function(i, x) {
		
		var length=$(this).attr("data-max-characters");
        var texts=$(this).text().split(" ",length).join(" ");
        $(this).text(texts.substring(0,70) + '.....');
		
		//var newI = i++;
		//var currDiv = $(this).closest('section#section-' + newI).find(x).length;
		//var prevDiv = $(this).closest('section#section-' + newI).find('.item-no').text();
		//var dx = $(this).closest('section#section-' + newI).find('.item-no').text(+ prevDiv + currDiv);
		
		if($(this).closest('section#section-1').find(x).length == 1){
			// All total
			var prevDiv = $(this).closest('section#section-1').find('.item-no').text();
			var currentDiv = $(this).closest('section#section-1').find(x);
			var dx = $(this).closest('section#section-1').find('.item-no').text(+ prevDiv + currentDiv.length);
		} else if($(this).closest('section#section-2').find(x).length == 1){
			// Dress total
			var prevDiv = $(this).closest('section#section-2').find('.item-no').text();
			var currentDiv = $(this).closest('section#section-2').find(x);
			var dx = $(this).closest('section#section-2').find('.item-no').text(+ prevDiv + currentDiv.length);
		} else if($(this).closest('section#section-3').find(x).length == 1){
			// Dress total
			var prevDiv = $(this).closest('section#section-3').find('.item-no').text();
			var currentDiv = $(this).closest('section#section-3').find(x);
			var dx = $(this).closest('section#section-3').find('.item-no').text(+ prevDiv + currentDiv.length);
		} else if($(this).closest('section#section-3').find(x).length == 1){
			// Dress total
			var prevDiv = $(this).closest('section#section-3').find('.item-no').text();
			var currentDiv = $(this).closest('section#section-3').find(x);
			var dx = $(this).closest('section#section-3').find('.item-no').text(+ prevDiv + currentDiv.length);
		} else if($(this).closest('section#section-4').find(x).length == 1){
			// Dress total
			var prevDiv = $(this).closest('section#section-4').find('.item-no').text();
			var currentDiv = $(this).closest('section#section-4').find(x);
			var dx = $(this).closest('section#section-4').find('.item-no').text(+ prevDiv + currentDiv.length);
		}
	});
	
	
	
	
	
	// + 2 cart 
	$(document).on('click', '#addCartZ', function(e) {
		e.stopImmediatePropagation();
		e.preventDefault();
		
		var totalP = sessionStorage.getItem('total_price');
		var listItem = sessionStorage.getItem('total_list');
		
		//Calling products info: 
        // $.ajax({
            // url: '/item/' + $.urlParam('name'),
			// type: 'Get',
            // contentType: 'application/json',
            // success: function (response) {
                // var tbodyEl = $('.box_1');

                // tbodyEl.html(response);
				// tbodyEl.append('\
					// <a href="checkout">\
					// <h3><span class="simpleCart_total">$0.00</span> (<span id="simpleCart_quantity" class="simpleCart_quantity">0</span>)<img src="images/bag.png" alt=""></h3>\
					// </a><p><a href="javascript:;" class="simpleCart_empty">Empty cart</a></p>\
					// <div class="clearfix"></div>\
				// ');
            // }
        // });
		
		if(totalP == null){
			
		
		var total = 0; //$('.simpleCart_total').val(sessionStorage.getItem('total_price'));
		var newP = $('.product-price span').text();
		var newDesc = $('.dress-name h3').text();
		var sum = newP.slice(1) + total;
		var newTotal = $('.simpleCart_total').text(sum);
		var newTotalQ = $('.simpleCart_quantity').text('1');
		
		sessionStorage.getItem('total_price') === sum;
		sessionStorage.getItem('total_list') === { newDesc: newP};
		}
		
	});
	
	$(document).on('click', '#viewModalItem', function(e) {
		
		var bh = $('.flex-viewport ul.slides li').css({'width': '190px', 'float': 'left', 'dispay': 'block'});
		var idImg = $(this).closest('.content_box').find('img').attr('src');
		
		//var imgModal = $('.flex-viewport ul.slides li').attr('data-thumb', idImg);
		var imgModalf = $('.flex-viewport ul.slides li img').attr('src', idImg);
		
		$(".flex-control-nav img").each(function(i, x) {
		  $(this).attr("src", idImg)
		  console.log($(this).attr("src"))
		});
		
		var fv = $(this).closest('.content_box').find('.item_price h6').text();
		var fx = $(this).closest('.content_box').find('h4').text();
		var fb = $(this).closest('.content_box').find('p').text();
		$('.price-new').text(fv);
		$('.desc1 h3').text(fx);
		$('.desc1 p').text(fb);
	});
	
});



