/*budgetController modülünün tanımı
Burada function () içinde aldığımızda dışarıdan irişimi engeliyoruz
 */
let budgetController = (function () {
    let x = 23;
    let add = function (a) {
        return x + a;
    };
    return {
        publicTest: function (b) {
            console.log(add(b));
        }
    }
})();

/*Arayuz guncelleme controlleri modülünün tanımı

 */
let UIController = (function () {

})();

/*budgetcontroller modülü  ile UIController  modülünü birleştireceğimiz controller modülü
 */
let controller = (function (budgetCtrl,UICtrl) {
budgetCtrl.publicTest(7);
})(budgetController,UIController);