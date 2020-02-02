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
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
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

    /*
    * toplam gelir ve gider hesaplama fonksiyonu
    * */
    let calculateTotal = function (type) {
        let sum = 0;
        data.allItems[type].forEach(function (current) {
            sum += current.value;
        });
        /*buradaki toplam gelir ve giderimizi totals nesnesi içindeki exp ve inc değişkenlerine
        * gönderdik.*/
        data.totals[type] = sum;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        deleteItem: function (type, id) {
            /*
            * Burada örneğin [ 1 2 4 6 8 ] gibi biri dizimiz var
            * biz burda örneğin id = 6 olan öğeyi silmek isteiğimizde direk olarak data.allItems[type][id]
            * ile silemeyiz. çünkü id = 6  olan öğeyi ancak index numarasına göre silmek gerekiyor.
            * bunun için önce gelen id nin index numarasını öğrenip ona göre silmemiz gerekir.*/

            // birinci yol

            data.allItems[type].forEach(function (current, index) {
                if (id === current.id) {
                    data.allItems[type].splice(index, 1);
                }
            });


            //ikinci yol
            /*
            let ids, index;
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                console.log("silindi");
                data.allItems[type].splice(index, 1);
            }

             */
        },

        calculateBudget: function (type) {
            //toplam expense ve income hesaplama
            calculateTotal("exp");
            calculateTotal("inc");
            // Hesaplanan bütçe  : income - expense
            data.budget = data.totals.inc - data.totals.exp;
            /*harcamalarımızın yüzdeliğinin hesaplanması
             expense = 100 ve income =200 ise 100/200 *100 = %50
             */
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (current) {
                current.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function () {
            let allPerc = data.allItems.exp.map(function (current) {
                return current.getPercentage();
            });

            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expenseContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage"
    };
    return {
        //return içinde yazdığımız kodları aslında  Controller modülünde erişmek için erişime açıyoruz.
        getInput: function () {
            //Girilen değerleri nesne olarak geri dönderiyoruz;
            return {
                type: document.querySelector(DOMStrings.inputType).value,    //.add__type gelecek değerler inc ve exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
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
        /*Silmek için seçtiğimiz nesneyi sildiğimiz zaman nesnenin ara yüzdende sildim.*/
        deleteListItem: function (selectorId) {
            let el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            let fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + " ," + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + " %";
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }
        },

        displayPercentages: function (percentages) {
            let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            let nodeListForEach = function (list, callback) {
                for (let i = 0; i < list.length ; i++) {
                    callback(list[i], i);
                }
            };
            nodeListForEach(fields, function (current, index) {
                if (percentages[index] >0){
                    current.textContent = percentages[index] + ' %';
                }else{
                    current.textContent = "---";
                }

            });
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
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    };

    /*bütçeyi güncelleme metodumuz
     */
    let updateBudget = function () {
        //1.Bütçeyi hesapla.
        budgetCtrl.calculateBudget();
        //2.hesaplnana bütçeyi geri dönder
        let budget = budgetCtrl.getBudget();
        //3.Bütçeyi UIController arayüzüne gönder.
        UICtrl.displayBudget(budget);
    };


    let updatePercentages = function () {
        //1.yüzdeleri güncelleme
        budgetCtrl.calculatePercentages();
        //2.budget controllerdan yüzdeleri okuma
        let percentages = budgetCtrl.getPercentages();
        //3.new yüzdeleri ara yüzde güncelleme
         UICtrl.displayPercentages(percentages);
    };

    let ctrlAddItem = function () {
        let input, newItem;
        //1. Girilen değerleri al.
        input = UICtrl.getInput();
        /*
        Girilen değerleri kontrol ettik.Yani description ve value değerlerinin boş girilmemesi için gerekli kontrolu
        yaptım.
         */
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2.itemleri bütçe denetleyicisine ekle.
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3.Eklenen öğeyi UIController ekle.
            UICtrl.addListItem(newItem, input.type);
            //4.alanları temizleme
            UICtrl.clearFields();
            //5. bütçeyi hesapla ve güncelle
            updateBudget();
            //6. yüzdelikleri hesapla ve güncelle
            updatePercentages();
        }

    };
    let ctrlDeleteItem = function (event) {
        let itemId, splitId, type, id;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitId = itemId.split('-');
        type = splitId[0];
        id = parseInt(splitId[1]);

        //1. seçilen nesne data yapisindan silinmesi
        budgetCtrl.deleteItem(type, id);
        //2. silinen nesnenin arayüzden silinmesi
        UICtrl.deleteListItem(itemId);
        //3. yeni bütçenin hesaplanmasının güncellenmesi
        updateBudget();
        //4. yüzdelikleri hesapla ve güncelle
        updatePercentages();
    };
    return {
        init: function () {
            console.log("Application has started!");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };


})(budgetController, UIController);

controller.init();