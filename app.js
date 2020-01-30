/*budgetController modülünün tanımı
Burada function () içinde aldığımızda dışarıdan irişimi engeliyoruz
 */
let budgetController = (function () {
    /*
    Burada Giderlerin kurucu metodu yaptım
     */
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    /*
    Burada Gelirin kurucu metodunu yaptım.
     */
    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    /*
    Burada her gider  ve gelir için oluşturulan nesnelerin  hepsini bir dizinin içinde koymak istedim.
     */


    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    return {
        /* addItem ile ile Expense ve Income gelen değerleri  Expense ve Income nesneleri
        allItems dizisinin içine eklendik.
        Burada gelen nesne için Expense ve Income olduğunu gelen type değerine göre
        hangisi olduğunu anlamaya çalıştık.
         */
        addItem: function (type, des, val) {
            let newItem, id;
            //[1 2 3 4 5 ] next id=6
            //[1 2 4 6 8 ], next id = 9
            //id = last id+1
            //yeni id oluşturma
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            //yeni nesne "exp" veya "inc" oluşturma
            if (type === 'exp') {
                newItem = new Expense(id, des, val);
            } else if (type === 'inc') {
                newItem = new Income(id, des, val);
            }
            //yeni oluşturulan newItem data içinde allItems ekleme
            data.allItems[type].push(newItem);
            //yeni oluşturulan nesnenin geri döndürülmesi
            return newItem;
        },
        testing: function () {
            console.log("Data : ", data);
        }
    };
})();


/*Arayuz guncelleme controlleri modülünün tanımı
 */
let UIController = (function () {
    /*
     documnet.querySelector() ile aldığımız sınıf isimleri ileride çok fazla yerde kullanıdığımız için
     ileride çok karmaşıklığa neden olacaktır.
     ikinci bir sıkıntımız ise ilerde çok yerde kullanıdğımız document.querySelector() ile alınan
     sınıf isimlerini değiştirmeye kalktığımızda ise çok yerde kullanıldığı için değiştirmek baya
     zahmetli olacaktır.
     bunun için kullanacağımız document.querySelector() ile sınıf isimlerini tek bir yerde toplamak
     hem olası karışıklığı engelemek için hemde ileride değiştirmek istedeiğimizde çok kolayca
     değiştirebiliceğiz.
     bunun için tüm sınıfları DOMStrings nesnesi altınta topladık.
     */
    let DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
        incomeContainer: '.income__list',
        expenseContainer: ".expenses__list"
    };
    return {
        //return içinde yazdığımız kodları aslında  Controller modülünde erişmek için erişime açıyoruz.
        getInput: function () {
            //Girilen değerleri nesne olarak geri dönderiyoruz;
            return {
                type: document.querySelector(DOMStrings.inputType).value,    //.add__type gelecek değerler inc ve exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
            };
        },
        /*
        Eklenen yeni nesneleri arayüzde görünlemek için addListItem fonksiyonun kullandık.
         */
        addListItem: function (obj, type) {
            let html, newHtml, element;
            // ilk olarak oluşturlan nesne için arayüzde HTML oluşturalım
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html =
                    '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>' +
                    '<div class="right clearfix"><div class="item__value">%value%</div>' +
                    '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    "</div> </div></div>";
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>' +
                    '<div class="right clearfix"> <div class="item__value">%value%</div>' +
                    '<div class="item__percentage">21%</div> <div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    " </div></div> </div>";
            }

            //buradaki html string ekranda statik değerlerle değiştirelim
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            //newHtml DOM ekleyelim
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },
        /*
         DOMStrings nesnemizi controller modülünden erişmek için getDOMStrings değişkenini tanımladık.
         ve geriye DOMStrings nesnesini dönderdik.
         */
        getDOMStrings: function () {
            return DOMStrings;
        }

    }
})();

/*budgetcontroller modülü  ile UIController  modülünü birleştireceğimiz controller modülü
 */
let controller = (function (budgetCtrl, UICtrl) {
    let setupEventListeners = function () {
        let DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };


    let ctrlAddItem = function () {
        let input, newItem;
        //1. Girilen değerleri al.
        input = UICtrl.getInput();

        //2.itemleri bütçe denetleyicisine ekle.
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //3.Eklenen öğeyi UIController ekle.
        UICtrl.addListItem(newItem, input.type);
        //4.Bütçeyi hesapla.

        //5.Bütçeyi UIController arayüzüne gönder.
    };
    return {
        init: function () {
            console.log("Application has started!");
            setupEventListeners();
        }
    };


})(budgetController, UIController);

controller.init();