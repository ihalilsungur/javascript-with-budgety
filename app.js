/*budgetController modülünün tanımı
Burada function () içinde aldığımızda dışarıdan irişimi engeliyoruz
 */
let budgetController = (function () {

})();

/*Arayuz guncelleme controlleri modülünün tanımı
 */
let UIController = (function () {
    return {
        getInput: function () {
            //Girilen değerleri nesne olarak geri dönderiyoruz;
            return {
                type: document.querySelector(".add__type").value,    //.add__type gelecek değerler inc ve exp
                description: document.querySelector(".add__description").value,
                value: document.querySelector(".add__value").value,
            };
        }
    }
})();

/*budgetcontroller modülü  ile UIController  modülünü birleştireceğimiz controller modülü
 */
let controller = (function (budgetCtrl, UICtrl) {

    let ctrlAddItem = function () {
        //1. Girilen değerleri al.
        let input = UICtrl.getInput();
        console.log(input);

        //2.itemleri bütçe denetleyicisine ekle.

        //3.Eklenen öğeyi UIController ekle.

        //4.Bütçeyi hesapla.

        //5.Bütçeyi UIController arayüzüne gönder.


    };
    document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });
})(budgetController, UIController);