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
        //1. Girilen değerleri al.
        let input = UICtrl.getInput();
        console.log(input);

        //2.itemleri bütçe denetleyicisine ekle.

        //3.Eklenen öğeyi UIController ekle.

        //4.Bütçeyi hesapla.

        //5.Bütçeyi UIController arayüzüne gönder.
    };
    return {
        init: function () {
            console.log("Application has started!");
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();