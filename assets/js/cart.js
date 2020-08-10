
    /*Cart related code*/
    $(".add").click(function() {
        $(this)
            .prev()
            .text(+$(this).prev().text() + 1);
        $(this).parent().prev().click();
    });
    $(".sub").click(function() {
        if ($(this).next().text() > 1) {
            if ($(this).next().text() > 1) {
                $(this)
                    .next()
                    .text(+$(this).next().text() - 1);
                $(this).parent().prev().click();
            }
        }
    });

    var shoppingCart = (function() {
        cart = [];

        function Item(name, price, count) {
            this.name = name;
            this.price = price;
            this.count = count;
        }

        // Save cart
        function saveCart() {
            //sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
        }

        // Load cart
        function loadCart() {
            //cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
        }
        if (sessionStorage.getItem("shoppingCart") != null) {
            //loadCart();
        }

        var obj = {};

        // Add to cart
        obj.addItemToCart = function(name, price, count) {
            for (var item in cart) {
                if (cart[item].name === name) {
                    cart[item].count++;
                    return;
                }
            }
            var item = new Item(name, price, count);
            cart.push(item);
            saveCart();
        };
        // Set count from item
        obj.setCountForItem = function(name, count) {
            for (var i in cart) {
                if (cart[i].name === name) {
                    cart[i].count = count;
                    break;
                }
            }
        };
        // Remove item from cart
        obj.removeItemFromCart = function(name) {
            for (var item in cart) {
                if (cart[item].name === name) {
                    cart[item].count--;
                    if (cart[item].count === 0) {
                        cart.splice(item, 1);
                    }
                    break;
                }
            }
            saveCart();
        };

        // Remove all items from cart
        obj.removeItemFromCartAll = function(name) {
            for (var item in cart) {
                if (cart[item].name === name) {
                    cart.splice(item, 1);
                    break;
                }
            }
            saveCart();
        };

        // Clear cart
        obj.clearCart = function() {
            cart = [];
            saveCart();
        };

        // Count cart
        obj.totalCount = function() {
            var totalCount = 0;
            for (var item in cart) {
                totalCount += cart[item].count;
            }
            return totalCount;
        };

        // Total cart
        obj.totalCart = function() {
            var totalCart = 0;
            for (var item in cart) {
                totalCart += cart[item].price * cart[item].count;
            }
            return Number(totalCart.toFixed(2));
        };

        // List cart
        obj.listCart = function() {
            var cartCopy = [];
            for (i in cart) {
                item = cart[i];
                itemCopy = {};
                for (p in item) {
                    itemCopy[p] = item[p];
                }
                itemCopy.total = Number(item.price * item.count).toFixed(2);
                cartCopy.push(itemCopy);
            }
            return cartCopy;
        };

        return obj;
    })();

    $(".add-to-cart").click(function(event) {
        $(".checkout-conatiner").css("visibility", "visible");
        var c = $(this).parent().find(".field .number-disp").text();
        event.preventDefault();
        var name = $(this).data("name");
        var price = Number($(this).data("price"));
        shoppingCart.addItemToCart(name, price, c);
        $(this).hide();
        $(this).next().show();
        displayCart();
    });

    $(".clear-cart").click(function() {
        shoppingCart.clearCart();
        displayCart();
    });

    function displayCart() {
        var cartArray = shoppingCart.listCart();
        var output = "";
        for (var i in cartArray) {
            output +=
                "<tr>" +
                "<td>" +
                cartArray[i].name +
                "</td>" +
                "<td>(" +
                cartArray[i].price +
                ")</td>" +
                "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" +
                cartArray[i].name +
                ">-</button>" +
                "<input type='number' style='width:50px' class='item-count form-control' data-name='" +
                cartArray[i].name +
                "' value='" +
                cartArray[i].count +
                "'>" +
                "<button class='plus-item btn btn-primary input-group-addon' data-name=" +
                cartArray[i].name +
                ">+</button></div></td>" +
                "<td><button class='delete-item btn btn-danger' data-name=" +
                cartArray[i].name +
                ">X</button></td>" +
                " = " +
                "<td>" +
                cartArray[i].total +
                "</td>" +
                "</tr>";
        }
        $(".show-cart").html(output);
        $(".total-cart").html(shoppingCart.totalCart());
        $(".total-count").html(shoppingCart.totalCount());
    }

    // Delete item button
    $(".show-cart").on("click", ".delete-item", function(event) {
        var name = $(this).data("name");
        shoppingCart.removeItemFromCartAll(name);
        displayCart();
    });

    //-1
    $(".show-cart").on("click", ".minus-item", function(event) {
        var name = $(this).data("name");
        shoppingCart.removeItemFromCart(name);
        displayCart();
    });

    // +1
    $(".show-cart").on("click", ".plus-item", function(event) {
        var name = $(this).data("name");
        shoppingCart.addItemToCart(name);
        displayCart();
    });
    // Item count input
    $(".show-cart").on("change", ".item-count", function(event) {
        var name = $(this).data("name");
        var count = Number($(this).val());
        shoppingCart.setCountForItem(name, count);
        displayCart();
    });

    displayCart();
/*Cart related code*/

/*Search and filter*/
    var $input = document.getElementById("myInput");

    var keyUpEventHandler = debounce(function(event) {
        var filter, a, i, txtValue;
        filter = $input.value.toUpperCase();
        row = document.getElementById("cards");
        column = row.getElementsByClassName("cards_item");
        for (i = 0; i < column.length; i++) {
            a = column[i].getElementsByTagName("div")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                column[i].style.display = "";
            } else {
                column[i].style.display = "none";
            }
        }
    }, 500);

    $input.addEventListener("keyup", keyUpEventHandler);

    function debounce(fn, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;

            clearTimeout(timeout);

            timeout = setTimeout(function() {
                fn.apply(context, args);
            }, wait);
        };
    }


    filterSelection("all");
    function filterSelection(c) {
        var x, i;
        x = document.getElementsByClassName("filterDiv");
        if (c == "all") c = "";
        for (i = 0; i < x.length; i++) {
            w3RemoveClass(x[i], "show");
            if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
        }
    }

    function w3AddClass(element, name) {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");
        for (i = 0; i < arr2.length; i++) {
            if (arr1.indexOf(arr2[i]) == -1) {
                element.className += " " + arr2[i];
            }
        }
    }

    function w3RemoveClass(element, name) {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");
        for (i = 0; i < arr2.length; i++) {
            while (arr1.indexOf(arr2[i]) > -1) {
                arr1.splice(arr1.indexOf(arr2[i]), 1);
            }
        }
        element.className = arr1.join(" ");
    }

    var btnContainer = document.getElementById("filter-control");
    var btns = btnContainer.getElementsByClassName("btn");
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
            var current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }

    $("#filter").click(function() {
        $("#filter-control").toggle();
        $(this).find(".filter-search-text").toggleClass("active");
        $("#filter-control").toggleClass("filter-control-spac");
    });
    $("#search").click(function() {
        $("#myInput").toggle();
        $(this).find(".filter-search-text").toggleClass("active");
        $("#myInput").toggleClass("filter-control-spac");
    });

    $(".categories .btn").click(function() {
        $(".categories .btn").removeClass('active');
        $(this).addClass('active')
    })


    function filterCategory(category) {
        if (category != undefined) {
            $('.filter-cat-results .f-cat').removeClass('active');
            $('.filter-cat-results .f-cat').filter('[data-cat="' + category + '"]').addClass('active');
            filterActive = category;
        }
    }

    $('.f-cat.show').addClass('active');

    $('.filtering button').click(function() {
        if ($(this).attr("data-value") == 'cat-all') {
            $('.filter-cat-results .f-cat').addClass('active');
            filterActive = 'cat-all';
        } else {
            filterCategory($(this).attr("data-value"));
        }
    });
/*Search and filter*/
