var obj = {"2":"#ffffff","test3":{"1":"#9a4343","3":"#a98181","5":"#b52b2b","7":{"test1":{"test2":{"test5":{"2":"#774c4c","4":"#cc9999"}},"test4":{"6":"#385f82","8":{"test4":{"5":"#385f82","1":"#9a5a5a"}}}}}},"test1":{"test2":{"test5":{"2":"#774c4c","4":"#cc9999"}},"test4":{"6":"#385f82","8":{"test4":{"7":"#385f82","6":"#9a5a5a"}}}}};

var TestSquares = function (obj) {
    var self = this,
        _obj = obj,
        _compObj = [];

    /*
проверка - пришел не пустой объект
     */
    this.isEmptyObj = function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              return true;
            }
        }
        return false;
    };

/*
перебираю входящий объект - вывожу в массива объектов - проще было бы вывести одним объектом, но ключи (те, которые будут border-width) могут быть одинаковыми, есть шанс упустить данные
 */
    this.goThroughtObj = function () {
        var i=0;
        function go(_obj) {
            for (var key in _obj) {
                if (typeof _obj[key] !== 'object'){
                    var currentObj = {};
                    currentObj[key] =  _obj[key];
                    _compObj[i] = currentObj;
                    i++;
                }
                else{
                    go(_obj[key]);
                }
            }
        }
        go(obj);
        // console.dir( _compObj);
        return _compObj;
    };
    this.sortObjUp = function (obj) {
        obj.sort(function ( obj1, obj2) {
            function getKey(currentObj) {
                for (var a in currentObj) {
                    return a;
                }
            }
            if (+getKey(obj1) < +getKey(obj2)) return -1;
            if (+getKey(obj1) > +getKey(obj2)) return 1;
            return 0;
        });
        // console.dir( _compObj);
        return _compObj
    };
    this.sortObjDown = function (obj) {
        obj.sort(function ( obj1, obj2) {
            function getKey(currentObj) {
                for (var a in currentObj) {
                    return a;
                }
            }
            if (+getKey(obj1) < +getKey(obj2)) return 1;
            if (+getKey(obj1) > +getKey(obj2)) return -1;
            return 0;
        });
        // console.dir( _compObj);
        return _compObj
    };


    /*
    функция если пришел объект пустой - я просто добавляю параграф, но можно развивать тему
     */
    this.notCreateSquares = function () {
        document.getElementById('root').innerHTML = '<p>Loading...</p>';
    };
    /*
    запись текущего объекта в localstorage
     */

    this.localStorageObj = function (obj) {
        var sObj = JSON.stringify(obj);
        localStorage.setItem("object", sObj);
    };

    /*
    рисуем квадратики
     */

    this.createSquares = function (_currenObj) {
        var squares = _currenObj,
            temp,
            squareBorderWidth = '',
            squareBorderColor = '',
            squareBg  ='',
            builtSqueares = '<div class = "js__outer">',
            addCShadowClass = '',
            i = 0;
        for (var key in squares) {
            temp = squares[key];
            for (var a in temp) {
                i++;
                if(i%2 ==0){
                    addCShadowClass = 'shadow';
                }else{
                    addCShadowClass = '';
                }
                squareBorderWidth = a;
                if(+a%2){
                    squareBorderColor = temp[a];
                    squareBg  ='#bbb';
                }else{
                    squareBg = temp[a];
                    squareBorderColor ='#bbb';
                }
                builtSqueares = builtSqueares +'<div id = "js__inner_'+i+'" class = "js__inner '+ addCShadowClass +'" onmouseover="testSquares.mouseOverSquares(this)" onmouseout="testSquares.mouseOutSqueares()" onclick="testSquares.onClickSquares(this);" style = "background-color: '+squareBg+'; border: '+squareBorderWidth+'px solid '+squareBorderColor+';"></div>';
                if(i%3 == 0){
                    builtSqueares = builtSqueares +'</div><div class = "js__outer">'
                }
            }
        }
        builtSqueares = builtSqueares +'<span id="js__inner_temp"></span></div>' +
            '<button id = "js__inner_button" onclick="testSquares.buttonFunc();">Click me</button>';
        document.getElementById('root').innerHTML = builtSqueares;

     /*
     записываю в localstorage
     */

     self.localStorageObj(_currenObj);
    };

    /*
    обработчики событий mouseOver, mouseOut, click
     */
    this.mouseOverSquares = function (el) {//можно через data-атрибуты, но решил через id
        var currentID = + el.id.replace('js__inner_','');
        var previousId = function () {
            if(currentID > 1){
                return 'js__inner_' + (currentID -1);
            }
            else{
                return 'js__inner_temp';
            }
        };
        var nextId = function () {
            if(currentID < document.getElementsByClassName('js__inner').length){
                return 'js__inner_' + (currentID +1);
            }else{
                return 'js__inner_temp';
            }
        };
        el.classList.add('current-mouse-over');
        document.getElementById(previousId()).classList.add('previous-mouse-over');
        document.getElementById(nextId()).classList.add('next-mouse-over');
    };
    this.mouseOutSqueares = function () {
        function clearClass(nameOfClass) {
            var temp = document.getElementsByClassName(nameOfClass);
            for (var i = 0;  i < temp.length; i++){
                temp[i].classList.remove(nameOfClass);
            }
        }
        clearClass('current-mouse-over');
        clearClass('previous-mouse-over');
        clearClass('next-mouse-over');
    };
    this.onClickSquares = function (el) {
        var elStyle = getComputedStyle(el),
            elBorderWidth = +elStyle.borderWidth.replace('px','');
        if(el.hasAttribute('data-border')){
            el.removeAttribute('data-border');
            el.style.borderWidth = (elBorderWidth/3)+'px';
        }else{
            el.setAttribute('data-border','clicked');
            el.style.borderWidth = (elBorderWidth*3)+'px';
        }
    };
    this.buttonFunc = function () {
        var el = document.getElementById('root');//почему этот элемент? - он единственный во всей конструкции, который не рендерится

        if(!el.hasAttribute('data-button')){
            el.setAttribute('data-button','up');
            self.createSquares( self.sortObjUp(_compObj));
        }else{
            if(el.getAttribute('data-button') == 'up'){
                // console.log('___up');
                el.setAttribute('data-button','down');
                self.createSquares( self.sortObjDown(_compObj));
            }else {
                el.removeAttribute('data-button');
                self.createSquares(self.goThroughtObj());
            }
        }
    };

    /*
    старт
     */

    if(typeof localStorage.object == 'undefined'){
        if (self.isEmptyObj(_obj)){
            self.createSquares(self.goThroughtObj());
        }else{
            self.notCreateSquares();
        }
    }else{
        _compObj = JSON.parse(localStorage.getItem("object"));
        self.createSquares(_compObj);
    }
};

    /*
    я предполагаю, что объект есть, что где-то на сервере есть проверка на наличие объекта
     */
var testSquares = new TestSquares(obj);

