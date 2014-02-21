//createSequence method creates a new sequence
createSequence(
    'es', //Sequence language
    'Calcular una viga de acero', //Sequence title
    'Calcula la viga de acero en función de las cargas introducidas', //Sequence info
    'Lampantino', //Sequence author
    'sre.quereck@gmail.com', //Sequence author email
    '0.2', //Sequence last version
    '20/02/2014', //Sequence last review date
 ['1NYcpukkrV6UywyJkggWkv7FwhDhijtM1C', 'lampantino', 'lampantino', 'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=sre%2equereck%40gmail%2ecom&lc=ES&item_name=Stepando&no_note=0&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHostedGuest'], //Sequence donation adresses
    'Estos resultados son orientativos y únicamente útiles para un predimensionado' //Sequence result information
);

//addStep methods creates new steps and adds them to the sequence
addStep(
    'luz', //Step reference
    '¿Qué luz tiene la viga?', //Step question
    'Input', //Step type
    'Float', //Step option
    'faja', //Next step
    'Ha de introducir la dimensión en metros' //Step info
);

//addStep methods creates new steps and adds them to the sequence
addStep(
    'faja', //Step reference
    '¿Qué faja de carga tiene el paño?', //Step question
    'Input', //Step type
    'Float', //Step option
    'pesoPropio', //Next step
    'Ha de introducir la dimensión en metros' //Step info
);

//addStep methods creates new steps and adds them to the sequence
addStep(
    'pesoPropio', //Step reference
    '¿Cuál es el peso propio del forjado?', //Step question
    'Input', //Step type
    'Float', //Step option
    'sobrecarga', //Next step
    'Ha de introducir el peso en kN/m2' //Step info
);

//addStep methods creates new steps and adds them to the sequence
addStep(
    'sobrecarga', //Step reference
    '¿Cuál es la sobrecarga del forjado?', //Step question
    'Input', //Step type
    'Float', //Step option
    'perfil', //Next step
    'Ha de introducir el peso en kN/m2' //Step info
);

//addStep methods creates new steps and adds them to the sequence
addStep(
    'perfil', //Step reference
    '¿A qué serie pertenece el perfil que desea calcular?', //Step question
    'Select', //Step type
 ['IPE', 'IPN', 'CHS (tubo circular)'], //Step option
    'limite', //Next step
    'Seleccione una serie' //Step info
);

//addStep methods creates new steps and adds them to the sequence
addStep(
    'limite', //Step reference
    'La viga ha de ser lo suficientemente rígida como para soportar:', //Step question
    'Select', //Step type
 ['Tabiques frágiles', 'Tabiques ordinarios', 'El resto de los casos'], //Step option
    'result', //Next step
    'Según lo indicado en el <a href="http://www.codigotecnico.org/web/recursos/documentos/dbse/se1/050.html" target="_blank">CTE DB-SE</a>' //Step info
);

//sequenceResult function contains the sequence logic and returns the result
function sequenceResult() {
    // Definición de constantes
    var mPP = 1.35; // Coeficiente de mayoración del peso propio
    var mSC = 1.50; // Coeficiente de mayoración de la sobrecarga
    var tensionAcero = 261904.76; // Tensión admisible del acero en KN/m2
    var moduloAcero = 210000000; // Módulo de elasticidad lineal del acero en KN/m2

    var resultado;

    // Definición de la clase viga
    var viga = function (vLuz, vFaja, vInercia, vModulo, vFlechaLimite, vPesoPropio, vSobreCarga) {
        // Propiedades
        // Geometría	
        var luz = vLuz; // en m
        var faja = vFaja; // en m
        var inercia = vInercia; // en cm4
        var modulo = vModulo; // en cm3
        var flechaLimite = vFlechaLimite; // en m
        // Acciones
        var pesoPropio = vPesoPropio; // en KN/m2
        var sobreCarga = vSobreCarga; // en KN/m2
        // Métodos
        // Función que devuelve el módulo necesario de una viga isostática (en cm3)
        this.calculoModulo = function () {
            var cargaLinealMayorada = (pesoPropio * mPP + sobreCarga * mSC) * faja;
            return (cargaLinealMayorada * luz * luz / 8) * 1000000 / tensionAcero;
        };
        // Función que devuelve la inercia necesaria de una viga isostática (en cm4)
        this.calculoInercia = function () {
            var cargaLineal = (pesoPropio * 1 + sobreCarga * 1) * faja;
            return (5 * cargaLineal * luz * luz * luz * luz) * 100000000 / (384 * moduloAcero * luz / flechaLimite);
        };
        //Función que devuelve la propiedad solicitada
        this.getVigaData = function (variable) {
            var answer;
            switch (variable) {
            case 'luz':
                answer = luz;
                break;
            case 'faja':
                answer = faja;
                break;
            case 'inercia':
                answer = inercia;
                break;
            case 'modulo':
                answer = modulo;
                break;
            case 'flecha':
                answer = flechaLimite;
                break;
            case 'pesoPropio':
                answer = pesoPropio;
                break;
            case 'sobreCarga':
                answer = sobreCarga;
                break;
            }
            return answer;
        };
        //Método que modifica la propiedad solicitada
        this.setVigaData = function (variable, dato) {
            switch (variable) {
            case 'luz':
                luz = dato;
                break;
            case 'faja':
                faja = dato;
                break;
            case 'inercia':
                inercia = dato;
                break;
            case 'modulo':
                modulo = dato;
                break;
            case 'flecha':
                flechaLimite = dato;
                break;
            case 'pesoPropio':
                pesoPropio = dato;
                break;
            case 'sobreCarga':
                sobreCarga = dato;
                break;
            }
        };
    };

    //Definición de la clase perfil
    var perfil = function (nombre, modulo, inercia, peso) {
        //Propiedades
        var nombreSerie = nombre; //Relación de tamaños de los perfiles de la serie
        var moduloSerie = modulo; //Relación de los módulos resistentes correspondientes (en cm3)
        var inerciaSerie = inercia; //Relación de las inercias correspondientes (en cm4)
        var pesoSerie = peso; //Relación de los pesos correspondientes (en kg/ml)
        //Métodos
        //Función que devuelve el peso de un perfil
        var encontrarPeso = function (perfil) {
            for(var i in nombreSerie) {
                if(nombreSerie[i] === perfil) {
                    return pesoSerie[i];
                }
            }
        };
        
        // Función que devuelve el perfil buscado
        this.encontrarPerfil = function (valor, listaSerie, listaPesos) {
            var encontrado = true;
            var resultado = "No existe ningún perfil que soporte esa carga";
            var resultadoTemp;
            var pesos = [];
            var temporal;
            var i = 0;
            while (encontrado) {
                if (valor < listaSerie[i]) {
                    if (resultado === "No existe ningún perfil que soporte esa carga") {
                        resultado = [nombreSerie[i]];
                    } else {
                        resultado.push(nombreSerie[i]);
                    }
                } else if (i >= listaSerie.length) {
                    encontrado = false;
                }
                i++;
            }
            if (resultado === "No existe ningún perfil que soporte esa carga") {
                return resultado;
            } else if (!listaPesos) {
                return resultado[0]+' ('+encontrarPeso(resultado[0])+'kg/ml)';
            } else {
                for (var i in nombreSerie) {
                    for (var j in resultado) {
                        if (resultado[j] === nombreSerie[i]) {
                            pesos.push(listaPesos[i]);
                        }
                    }
                }
                temporal = pesos[0];
                resultadoTemp = resultado[0];
                for (var i in resultado) {
                    if (pesos[i] < temporal) {
                        temporal = pesos[i];
                        resultadoTemp = resultado[i];
                    }
                }
                return resultadoTemp+' ('+encontrarPeso(resultadoTemp)+'kg/ml)';
            }
        };

        this.getModulo = function () {
            return moduloSerie;
        };
        //Función que devuelve la inercia
        this.getInercia = function () {
            return inerciaSerie;
        };
        //Función que devuelve la inercia
        this.getPeso = function () {
            return pesoSerie;
        };
        //Función que devuelve la inercia
        this.getCanto = function () {
            return cantoSerie;
        };
    };

    // Creamos un objeto de la clase perfil para perfiles de la serie IPE
    var IPE = new perfil(
 ["IPE80", "IPE100", "IPE120", "IPE140", "IPE160", "IPE180", "IPE200", "IPE220", "IPE240", "IPE270", "IPE300", "IPE330", "IPE360", "IPE400", "IPE450", "IPE500", "IPE550", "IPE600"], [20, 34.2, 53, 77.3, 109, 146, 194, 252, 324, 429, 557, 713, 904, 1160, 1500, 1930, 2440, 3070], [80.1, 171, 318, 541, 869, 1320, 1940, 2770, 3890, 5790, 8360, 11770, 16270, 23130, 33740, 48200, 67120, 92080], [6, 8.1, 10.4, 12.9, 15.8, 18.8, 22.4, 26.2, 30.7, 36.1, 42.2, 49.1, 57.1, 66.3, 77.6, 90.7, 106, 122]);

    // Creamos un objeto de la clase perfil para perfiles de la serie IPN
    var IPN = new perfil(
 ["IPN80", "IPN100", "IPN120", "IPN140", "IPN160", "IPN180", "IPN200", "IPN220", "IPN240", "IPN260", "IPN280", "IPN300", "IPN320", "IPN340", "IPN360", "IPN380", "IPN400", "IPN450", "IPN500", "IPN550", "IPN600"], [19.5, 34.2, 54.7, 81.9, 117, 161, 214, 278, 354, 442, 542, 653, 782, 923, 1090, 1260, 1460, 2040, 2750, 3610, 4630], [77.8, 171, 328, 573, 935, 1450, 2140, 3060, 4250, 5740, 7590, 9800, 12510, 15700, 19610, 24010, 29210, 45850, 68740, 99180, 139000], [5.95, 8.32, 11.2, 14.4, 17.9, 21.9, 26.3, 31.1, 36.2, 41.9, 48, 54.2, 61.1, 68.1, 76.2, 84, 92.6, 115, 141, 167, 199]);

    // Creamos un objeto de la clase perfil para perfiles de la serie CHS
    var CHSNombres = ['CHS17.2x1.5', 'CHS17.2x2', 'CHS17.2x2.3', 'CHS17.2x2.5', 'CHS21.3x1.5', 'CHS21.3x2', 'CHS21.3x2.3', 'CHS21.3x2.5', 'CHS21.3x2.9', 'CHS21.3x3', 'CHS25x1.5', 'CHS25x2', 'CHS25x2.3', 'CHS25x2.5', 'CHS25x2.9', 'CHS25x3', 'CHS26.9x1.5', 'CHS26.9x2', 'CHS26.9x2.3', 'CHS26.9x2.5', 'CHS26.9x2.9', 'CHS26.9x3', 'CHS28x1.5', 'CHS28x2', 'CHS28x2.3', 'CHS28x2.5', 'CHS28x2.9', 'CHS28x3', 'CHS30x1.5', 'CHS30x2', 'CHS30x2.3', 'CHS30x2.5', 'CHS30x2.9', 'CHS30x3', 'CHS32x1.5', 'CHS32x2', 'CHS32x2.3', 'CHS32x2.5', 'CHS32x2.9', 'CHS32x3', 'CHS33.7x1.5', 'CHS33.7x2', 'CHS33.7x2.3', 'CHS33.7x2.5', 'CHS33.7x2.9', 'CHS33.7x3', 'CHS33.7x3.2', 'CHS33.7x3.6', 'CHS33.7x4', 'CHS35x1.5', 'CHS35x2', 'CHS35x2.3', 'CHS35x2.5', 'CHS35x2.9', 'CHS35x3', 'CHS35x3.2', 'CHS35x3.6', 'CHS35x4', 'CHS37.5x1.5', 'CHS37.5x2', 'CHS37.5x2.3', 'CHS37.5x2.5', 'CHS37.5x2.9', 'CHS37.5x3', 'CHS37.5x3.2', 'CHS37.5x3.6', 'CHS37.5x4', 'CHS38x1.5', 'CHS38x2', 'CHS38x2.3', 'CHS38x2.5', 'CHS38x2.9', 'CHS38x3', 'CHS38x3.2', 'CHS38x3.6', 'CHS38x4', 'CHS38x5', 'CHS39x1.5', 'CHS39x2', 'CHS39x2.3', 'CHS39x2.5', 'CHS39x2.9', 'CHS39x3', 'CHS39x3.2', 'CHS39x3.6', 'CHS39x4', 'CHS40x1.5', 'CHS40x2', 'CHS40x2.3', 'CHS40x2.5', 'CHS40x2.9', 'CHS40x3', 'CHS40x3.2', 'CHS40x3.6', 'CHS40x4', 'CHS41.5x1.5', 'CHS41.5x2', 'CHS41.5x2.3', 'CHS41.5x2.5', 'CHS41.5x2.9', 'CHS41.5x3', 'CHS41.5x3.2', 'CHS41.5x3.6', 'CHS41.5x4', 'CHS42x1.5', 'CHS42x2', 'CHS42x2.3', 'CHS42x2.5', 'CHS42x2.9', 'CHS42x3', 'CHS42x3.2', 'CHS42x3.6', 'CHS42x4', 'CHS42.4x1.5', 'CHS42.4x2', 'CHS42.4x2.3', 'CHS42.4x2.5', 'CHS42.4x2.9', 'CHS42.4x3', 'CHS42.4x3.2', 'CHS42.4x3.6', 'CHS42.4x4', 'CHS42.4x5', 'CHS42.4x6', 'CHS42.4x6.3', 'CHS44.5x1.5', 'CHS44.5x2', 'CHS44.5x2.3', 'CHS44.5x2.5', 'CHS44.5x2.9', 'CHS44.5x3', 'CHS44.5x3.2', 'CHS44.5x3.6', 'CHS44.5x4', 'CHS45x1.5', 'CHS45x2', 'CHS45x2.3', 'CHS45x2.5', 'CHS45x2.9', 'CHS45x3', 'CHS45x3.2', 'CHS45x3.6', 'CHS45x4', 'CHS45x5', 'CHS45x6', 'CHS45x6.3', 'CHS48x1.5', 'CHS48x2', 'CHS48x2.3', 'CHS48x2.5', 'CHS48x2.9', 'CHS48x3', 'CHS48x3.2', 'CHS48x3.6', 'CHS48x4', 'CHS48.3x1.5', 'CHS48.3x2', 'CHS48.3x2.3', 'CHS48.3x2.5', 'CHS48.3x2.9', 'CHS48.3x3', 'CHS48.3x3.2', 'CHS48.3x3.6', 'CHS48.3x4', 'CHS48.3x5', 'CHS48.3x6', 'CHS48.3x6.3', 'CHS48.6x1.5', 'CHS48.6x2', 'CHS48.6x2.3', 'CHS48.6x2.5', 'CHS48.6x2.9', 'CHS48.6x3', 'CHS48.6x3.2', 'CHS48.6x3.6', 'CHS48.6x4', 'CHS49.4x2', 'CHS49.4x2.3', 'CHS49.4x2.5', 'CHS49.4x2.9', 'CHS49.4x3', 'CHS49.4x3.2', 'CHS49.4x3.6', 'CHS49.4x4', 'CHS49.4x5', 'CHS50x1.5', 'CHS50x2', 'CHS50x2.3', 'CHS50x2.5', 'CHS50x2.9', 'CHS50x3', 'CHS50x3.2', 'CHS50x3.6', 'CHS50x4', 'CHS50x5', 'CHS50x6', 'CHS50x6.3', 'CHS51x1.5', 'CHS51x2', 'CHS51x2.3', 'CHS51x2.5', 'CHS51x2.9', 'CHS51x3', 'CHS51x3.2', 'CHS51x3.6', 'CHS51x4', 'CHS51x5', 'CHS51x6', 'CHS51x6.3', 'CHS52x1.5', 'CHS52x2', 'CHS52x2.3', 'CHS52x2.5', 'CHS52x2.9', 'CHS52x3', 'CHS52x3.2', 'CHS52x3.6', 'CHS52x4', 'CHS52x5', 'CHS52x6', 'CHS52x6.3', 'CHS55x1.5', 'CHS55x2', 'CHS55x2.3', 'CHS55x2.5', 'CHS55x2.9', 'CHS55x3', 'CHS55x3.2', 'CHS55x3.6', 'CHS55x4', 'CHS55x5', 'CHS55x6', 'CHS55x6.3', 'CHS56x2', 'CHS57x1.5', 'CHS57x2', 'CHS57x2.3', 'CHS57x2.5', 'CHS57x2.9', 'CHS57x3', 'CHS57x3.2', 'CHS57x3.6', 'CHS57x4', 'CHS57x5', 'CHS57x6', 'CHS57x6.3', 'CHS58x2', 'CHS58x2.3', 'CHS58x2.5', 'CHS58x2.9', 'CHS58x3', 'CHS58x3.2', 'CHS58x3.6', 'CHS58x4', 'CHS58x5', 'CHS58x6', 'CHS58x6.3', 'CHS60x1.5', 'CHS60x2', 'CHS60x2.3', 'CHS60x2.5', 'CHS60x2.9', 'CHS60x3', 'CHS60x3.2', 'CHS60x3.6', 'CHS60x4', 'CHS60x5', 'CHS60x6', 'CHS60x6.3', 'CHS60.3x1.5', 'CHS60.3x2', 'CHS60.3x2.3', 'CHS60.3x2.5', 'CHS60.3x2.9', 'CHS60.3x3', 'CHS60.3x3.2', 'CHS60.3x3.6', 'CHS60.3x4', 'CHS60.3x5', 'CHS60.3x6', 'CHS60.3x6.3', 'CHS61.5x2', 'CHS61.5x2.3', 'CHS61.5x2.5', 'CHS61.5x2.9', 'CHS61.5x3', 'CHS61.5x3.2', 'CHS61.5x3.6', 'CHS61.5x4', 'CHS61.5x5', 'CHS61.5x6', 'CHS61.5x6.3', 'CHS62x1.5', 'CHS62x2', 'CHS62x2.3', 'CHS62x2.5', 'CHS62x2.9', 'CHS62x3', 'CHS62x3.2', 'CHS62x3.6', 'CHS62x4', 'CHS62.2x2', 'CHS62.2x2.3', 'CHS62.2x2.5', 'CHS62.2x2.9', 'CHS62.2x3', 'CHS62.2x3.2', 'CHS62.2x3.6', 'CHS62.2x4', 'CHS62.2x5', 'CHS62.2x6', 'CHS62.2x6.3', 'CHS63x1.5', 'CHS63x2', 'CHS63x2.3', 'CHS63x2.5', 'CHS63x2.9', 'CHS63x3', 'CHS63x3.2', 'CHS63x3.6', 'CHS63x4', 'CHS63x5', 'CHS63x6', 'CHS63x6.3', 'CHS63.5x1.5', 'CHS63.5x2', 'CHS63.5x2.3', 'CHS63.5x2.5', 'CHS63.5x2.9', 'CHS63.5x3', 'CHS63.5x3.2', 'CHS63.5x3.6', 'CHS63.5x4', 'CHS63.5x5', 'CHS63.5x6', 'CHS63.5x6.3', 'CHS66x2', 'CHS66x2.3', 'CHS66x2.5', 'CHS66x2.9', 'CHS66x3', 'CHS66x3.2', 'CHS66x3.6', 'CHS66x4', 'CHS66x5', 'CHS66x6', 'CHS66x6.3', 'CHS68x2', 'CHS70x1.5', 'CHS70x2', 'CHS70x2.3', 'CHS70x2.5', 'CHS70x2.9', 'CHS70x3', 'CHS70x3.2', 'CHS70x3.6', 'CHS70x4', 'CHS70x5', 'CHS70x6', 'CHS70x6.3', 'CHS71.5x2', 'CHS71.5x2.3', 'CHS71.5x2.5', 'CHS71.5x2.9', 'CHS71.5x3', 'CHS71.5x3.2', 'CHS71.5x3.6', 'CHS71.5x4', 'CHS71.5x5', 'CHS71.5x6', 'CHS71.5x6.3', 'CHS72x2', 'CHS72x2.3', 'CHS72x2.5', 'CHS72x2.9', 'CHS72x3', 'CHS72x3.2', 'CHS72x3.6', 'CHS72x4', 'CHS72x5', 'CHS72x6', 'CHS72x6.3', 'CHS75.5x2', 'CHS75.5x2.3', 'CHS75.5x2.5', 'CHS75.5x2.9', 'CHS75.5x3', 'CHS75.5x3.2', 'CHS75.5x3.6', 'CHS75.5x4', 'CHS75.5x5', 'CHS75.5x6', 'CHS75.5x6.3', 'CHS76x1.5', 'CHS76x2', 'CHS76x2.3', 'CHS76x2.5', 'CHS76x2.9', 'CHS76x3', 'CHS76x3.2', 'CHS76x3.6', 'CHS76x4', 'CHS76x5', 'CHS76x6', 'CHS76x6.3', 'CHS76.1x1.5', 'CHS76.1x2', 'CHS76.1x2.3', 'CHS76.1x2.5', 'CHS76.1x2.9', 'CHS76.1x3', 'CHS76.1x3.2', 'CHS76.1x3.6', 'CHS76.1x4', 'CHS76.1x5', 'CHS76.1x6', 'CHS76.1x6.3', 'CHS80x1.5', 'CHS80x2', 'CHS80x2.3', 'CHS80x2.5', 'CHS80x2.9', 'CHS80x3', 'CHS80x3.2', 'CHS80x3.6', 'CHS80x4', 'CHS80x5', 'CHS80x6', 'CHS80x6.3', 'CHS82.5x2', 'CHS82.5x2.3', 'CHS82.5x2.5', 'CHS82.5x2.9', 'CHS82.5x3', 'CHS82.5x3.2', 'CHS82.5x3.6', 'CHS82.5x4', 'CHS82.5x5', 'CHS82.5x6', 'CHS82.5x6.3', 'CHS83x1.5', 'CHS83x2', 'CHS83x2.3', 'CHS83x2.5', 'CHS83x2.9', 'CHS83x3', 'CHS83x3.2', 'CHS83x3.6', 'CHS83x4', 'CHS83x5', 'CHS83x6', 'CHS83x6.3', 'CHS84x2', 'CHS84x2.3', 'CHS84x2.5', 'CHS84x2.9', 'CHS84x3', 'CHS84x3.2', 'CHS84x3.6', 'CHS84x4', 'CHS84x5', 'CHS84x6', 'CHS84x6.3', 'CHS88.9x1.5', 'CHS88.9x2', 'CHS88.9x2.3', 'CHS88.9x2.5', 'CHS88.9x2.9', 'CHS88.9x3', 'CHS88.9x3.2', 'CHS88.9x3.6', 'CHS88.9x4', 'CHS88.9x5', 'CHS88.9x6', 'CHS88.9x6.3', 'CHS88.9x7', 'CHS88.9x8', 'CHS88.9x10', 'CHS89x1.5', 'CHS89x2', 'CHS89x2.3', 'CHS89x2.5', 'CHS89x2.9', 'CHS89x3', 'CHS89x3.2', 'CHS89x3.6', 'CHS89x4', 'CHS89x5', 'CHS89x6', 'CHS89x6.3', 'CHS90x1.5', 'CHS90x2', 'CHS90x2.3', 'CHS90x2.5', 'CHS90x2.9', 'CHS90x3', 'CHS90x3.2', 'CHS90x3.6', 'CHS90x4', 'CHS95x1.5', 'CHS95x2', 'CHS95x2.3', 'CHS95x2.5', 'CHS95x2.9', 'CHS95x3', 'CHS95x3.2', 'CHS95x3.6', 'CHS95x4', 'CHS95x5', 'CHS95x6', 'CHS95x6.3', 'CHS96x2', 'CHS96x2.3', 'CHS96x2.5', 'CHS96x2.9', 'CHS96x3', 'CHS96x3.2', 'CHS96x3.6', 'CHS96x4', 'CHS96x5', 'CHS96x6', 'CHS96x6.3', 'CHS96x7', 'CHS96x8', 'CHS96x10', 'CHS100x1.5', 'CHS100x2', 'CHS100x2.3', 'CHS100x2.5', 'CHS100x2.9', 'CHS100x3', 'CHS100x3.2', 'CHS100x3.6', 'CHS100x4', 'CHS100x5', 'CHS100x6', 'CHS100x6.3', 'CHS100x7', 'CHS100x8', 'CHS101.6x1.5', 'CHS101.6x2', 'CHS101.6x2.3', 'CHS101.6x2.5', 'CHS101.6x2.9', 'CHS101.6x3', 'CHS101.6x3.2', 'CHS101.6x3.6', 'CHS101.6x4', 'CHS101.6x5', 'CHS101.6x6', 'CHS101.6x6.3', 'CHS101.6x7', 'CHS101.6x8', 'CHS101.6x10', 'CHS108x1.5', 'CHS108x2', 'CHS108x2.3', 'CHS108x2.5', 'CHS108x2.9', 'CHS108x3', 'CHS108x3.2', 'CHS108x3.6', 'CHS108x4', 'CHS108x5', 'CHS108x6', 'CHS108x6.3', 'CHS108x7', 'CHS108x8', 'CHS108x10', 'CHS110x2', 'CHS110x2.3', 'CHS110x2.5', 'CHS110x2.9', 'CHS110x3', 'CHS110x3.2', 'CHS110x3.6', 'CHS110x4', 'CHS113x1.5', 'CHS113x2', 'CHS113x2.3', 'CHS113x2.5', 'CHS113x2.9', 'CHS113x3', 'CHS113x3.2', 'CHS113x3.6', 'CHS113x4', 'CHS113x5', 'CHS113x6', 'CHS113x6.3', 'CHS113x7', 'CHS113x8', 'CHS114x1.5', 'CHS114x2', 'CHS114x2.3', 'CHS114x2.5', 'CHS114x2.9', 'CHS114x3', 'CHS114x3.2', 'CHS114x3.6', 'CHS114x4', 'CHS114x5', 'CHS114x6', 'CHS114x6.3', 'CHS114x7', 'CHS114x8', 'CHS114x10', 'CHS114.3x1.5', 'CHS114.3x2', 'CHS114.3x2.3', 'CHS114.3x2.5', 'CHS114.3x2.9', 'CHS114.3x3', 'CHS114.3x3.2', 'CHS114.3x3.6', 'CHS114.3x4', 'CHS114.3x5', 'CHS114.3x6', 'CHS114.3x6.3', 'CHS114.3x7', 'CHS114.3x8', 'CHS114.3x10', 'CHS120x1.5', 'CHS120x2', 'CHS120x2.3', 'CHS120x2.5', 'CHS120x2.9', 'CHS120x3', 'CHS120x3.2', 'CHS120x3.6', 'CHS120x4', 'CHS120x5', 'CHS120x6', 'CHS120x6.3', 'CHS125x2', 'CHS125x2.3', 'CHS125x2.5', 'CHS125x2.9', 'CHS125x3', 'CHS125x3.2', 'CHS125x3.6', 'CHS125x4', 'CHS125x5', 'CHS125x6', 'CHS125x6.3', 'CHS125x7', 'CHS125x8', 'CHS125x10', 'CHS125x12.5', 'CHS127x2', 'CHS127x2.3', 'CHS127x2.5', 'CHS127x2.9', 'CHS127x3', 'CHS127x3.2', 'CHS127x3.6', 'CHS127x4', 'CHS127x5', 'CHS127x6', 'CHS127x6.3', 'CHS127x7', 'CHS127x8', 'CHS127x10', 'CHS133x2', 'CHS133x2.3', 'CHS133x2.5', 'CHS133x2.9', 'CHS133x3', 'CHS133x3.2', 'CHS133x3.6', 'CHS133x4', 'CHS133x5', 'CHS133x6', 'CHS133x6.3', 'CHS133x7', 'CHS133x8', 'CHS133x10', 'CHS139.7x2', 'CHS139.7x2.3', 'CHS139.7x2.5', 'CHS139.7x2.9', 'CHS139.7x3', 'CHS139.7x3.2', 'CHS139.7x3.6', 'CHS139.7x4', 'CHS139.7x5', 'CHS139.7x6', 'CHS139.7x6.3', 'CHS139.7x7', 'CHS139.7x8', 'CHS139.7x10', 'CHS139.7x12.5', 'CHS152x2', 'CHS152x2.3', 'CHS152x2.5', 'CHS152x2.9', 'CHS152x3', 'CHS152x3.2', 'CHS152x3.6', 'CHS152x4', 'CHS152x5', 'CHS152x6', 'CHS152x6.3', 'CHS152x7', 'CHS152x8', 'CHS152x10', 'CHS152x12.5', 'CHS152.4x2', 'CHS152.4x2.3', 'CHS152.4x2.5', 'CHS152.4x2.9', 'CHS152.4x3', 'CHS152.4x3.2', 'CHS152.4x3.6', 'CHS152.4x4', 'CHS152.4x5', 'CHS152.4x6', 'CHS152.4x6.3', 'CHS152.4x7', 'CHS152.4x8', 'CHS152.4x10', 'CHS152.4x12.5', 'CHS159x1.5', 'CHS159x2', 'CHS159x2.3', 'CHS159x2.5', 'CHS159x2.9', 'CHS159x3', 'CHS159x3.2', 'CHS159x3.6', 'CHS159x4', 'CHS159x5', 'CHS159x6', 'CHS159x6.3', 'CHS159x7', 'CHS159x8', 'CHS159x10', 'CHS164x2', 'CHS164x2.3', 'CHS164x2.5', 'CHS164x2.9', 'CHS164x3', 'CHS164x3.2', 'CHS164x3.6', 'CHS164x4', 'CHS164x5', 'CHS164x6', 'CHS164x6.3', 'CHS165.1x3', 'CHS165.1x3.2', 'CHS165.1x3.6', 'CHS165.1x4', 'CHS165.1x5', 'CHS165.1x6', 'CHS165.1x6.3', 'CHS165.1x7', 'CHS165.1x8', 'CHS168x2.5', 'CHS168x2.9', 'CHS168x3', 'CHS168x3.2', 'CHS168x3.6', 'CHS168x4', 'CHS168x5', 'CHS168x6', 'CHS168x6.3', 'CHS168.1x2.5', 'CHS168.1x2.9', 'CHS168.1x3', 'CHS168.1x3.2', 'CHS168.1x3.6', 'CHS168.1x4', 'CHS168.1x5', 'CHS168.1x6', 'CHS168.3x2.5', 'CHS168.3x2.9', 'CHS168.3x3', 'CHS168.3x3.2', 'CHS168.3x3.6', 'CHS168.3x4', 'CHS168.3x5', 'CHS168.3x6', 'CHS168.3x6.3', 'CHS168.3x7', 'CHS168.3x8', 'CHS168.3x10', 'CHS168.3x12.5', 'CHS177.8x3', 'CHS177.8x3.2', 'CHS177.8x3.6', 'CHS177.8x4', 'CHS177.8x5', 'CHS177.8x6', 'CHS177.8x6.3', 'CHS177.8x7', 'CHS177.8x8', 'CHS177.8x10', 'CHS193.7x3', 'CHS193.7x3.2', 'CHS193.7x3.6', 'CHS193.7x4', 'CHS193.7x5', 'CHS193.7x6', 'CHS193.7x6.3', 'CHS193.7x7', 'CHS193.7x8', 'CHS193.7x10', 'CHS193.7x12.5', 'CHS200x3', 'CHS200x3.2', 'CHS200x3.6', 'CHS200x4', 'CHS200x5', 'CHS200x6', 'CHS200x6.3', 'CHS200x7', 'CHS200x8', 'CHS219.1x3', 'CHS219.1x3.2', 'CHS219.1x3.6', 'CHS219.1x4', 'CHS219.1x5', 'CHS219.1x6', 'CHS219.1x6.3', 'CHS219.1x7', 'CHS219.1x8', 'CHS219.1x10', 'CHS219.1x12.5', 'CHS244.5x4', 'CHS244.5x5', 'CHS244.5x6', 'CHS244.5x6.3', 'CHS244.5x7', 'CHS244.5x8', 'CHS244.5x10', 'CHS244.5x12.5', 'CHS273x4', 'CHS273x5', 'CHS273x6', 'CHS273x6.3', 'CHS273x7', 'CHS273x8', 'CHS273x10', 'CHS273x12.5', 'CHS273.1x5', 'CHS273.1x6', 'CHS273.1x6.3', 'CHS273.1x7', 'CHS273.1x8', 'CHS273.1x10', 'CHS273.1x12.5', 'CHS323.9x4', 'CHS323.9x5', 'CHS323.9x6', 'CHS323.9x6.3', 'CHS323.9x7', 'CHS323.9x8', 'CHS323.9x10', 'CHS323.9x12.5', 'CHS323.9x14.2', 'CHS323.9x16', 'CHS339.7x5', 'CHS339.7x6', 'CHS339.7x6.3', 'CHS339.7x7', 'CHS339.7x8', 'CHS339.7x10', 'CHS355.6x5', 'CHS355.6x6', 'CHS355.6x6.3', 'CHS355.6x7', 'CHS355.6x8', 'CHS355.6x10', 'CHS355.6x12.5', 'CHS355.6x14.2', 'CHS355.6x16', 'CHS406.4x5', 'CHS406.4x6', 'CHS406.4x6.3', 'CHS406.4x7', 'CHS406.4x8'
];

    var CHSModulos = [0.267, 0.326, 0.356, 0.373, 0.432, 0.536, 0.59, 0.623, 0.683, 0.696, 0.614, 0.77, 0.854, 0.906, 1, 1.02, 0.72, 0.907, 1.01, 1.07, 1.19, 1.21, 0.786, 0.992, 1.1, 1.17, 1.3, 1.33, 0.912, 1.16, 1.29, 1.37, 1.53, 1.56, 1.05, 1.33, 1.49, 1.59, 1.77, 1.82, 1.17, 1.49, 1.67, 1.78, 1.99, 2.04, 2.14, 2.32, 2.49, 1.27, 1.62, 1.81, 1.94, 2.17, 2.23, 2.33, 2.53, 2.72, 1.47, 1.88, 2.11, 2.26, 2.53, 2.6, 2.73, 2.97, 3.19, 1.51, 1.93, 2.17, 2.32, 2.61, 2.68, 2.81, 3.06, 3.29, 3.8, 1.6, 2.05, 2.3, 2.46, 2.77, 2.84, 2.98, 3.25, 3.5, 1.68, 2.16, 2.43, 2.6, 2.93, 3, 3.15, 3.44, 3.71, 1.82, 2.34, 2.63, 2.82, 3.17, 3.26, 3.43, 3.74, 4.04, 1.87, 2.4, 2.7, 2.89, 3.26, 3.35, 3.52, 3.85, 4.15, 1.9, 2.45, 2.76, 2.95, 3.33, 3.42, 3.59, 3.93, 4.24, 4.93, 5.51, 5.66, 2.11, 2.72, 3.06, 3.28, 3.7, 3.8, 4, 4.38, 4.74, 2.16, 2.78, 3.13, 3.36, 3.79, 3.9, 4.1, 4.49, 4.86, 5.67, 6.36, 6.54, 2.47, 3.19, 3.6, 3.86, 4.37, 4.49, 4.73, 5.19, 5.62, 2.5, 3.23, 3.65, 3.92, 4.43, 4.55, 4.8, 5.26, 5.7, 6.69, 7.53, 7.76, 2.54, 3.28, 3.7, 3.97, 4.49, 4.62, 4.86, 5.34, 5.78, 3.39, 3.83, 4.11, 4.65, 4.78, 5.04, 5.53, 6, 7.05, 2.69, 3.48, 3.93, 4.22, 4.78, 4.91, 5.18, 5.68, 6.16, 7.25, 8.18, 8.43, 2.8, 3.63, 4.1, 4.4, 4.99, 5.13, 5.41, 5.94, 6.44, 7.58, 8.57, 8.84, 2.92, 3.78, 4.27, 4.59, 5.2, 5.35, 5.64, 6.2, 6.73, 7.93, 8.97, 9.25, 3.28, 4.26, 4.82, 5.18, 5.87, 6.04, 6.38, 7.02, 7.62, 9.01, 10.2, 10.6, 4.42, 3.54, 4.59, 5.2, 5.59, 6.35, 6.53, 6.89, 7.59, 8.25, 9.78, 11.1, 11.5, 4.76, 5.39, 5.8, 6.59, 6.78, 7.16, 7.88, 8.58, 10.2, 11.6, 12, 3.93, 5.11, 5.79, 6.23, 7.09, 7.29, 7.7, 8.49, 9.24, 11, 12.5, 12.9, 3.97, 5.17, 5.85, 6.3, 7.16, 7.37, 7.78, 8.58, 9.34, 11.1, 12.7, 13.1, 5.39, 6.1, 6.57, 7.47, 7.69, 8.12, 8.96, 9.76, 11.6, 13.3, 13.7, 4.21, 5.48, 6.21, 6.68, 7.6, 7.83, 8.27, 9.12, 9.93, 5.52, 6.25, 6.73, 7.65, 7.88, 8.32, 9.18, 10, 11.9, 13.6, 14.1, 4.35, 5.67, 6.42, 6.91, 7.87, 8.1, 8.56, 9.44, 10.3, 12.3, 14, 14.5, 4.42, 5.76, 6.53, 7.03, 8, 8.24, 8.7, 9.6, 10.5, 12.5, 14.3, 14.8, 6.25, 7.08, 7.63, 8.69, 8.95, 9.46, 10.4, 11.4, 13.6, 15.6, 16.1, 6.65, 5.41, 7.06, 8.02, 8.64, 9.85, 10.1, 10.7, 11.9, 13, 15.5, 17.8, 18.4, 7.38, 8.38, 9.03, 10.3, 10.6, 11.2, 12.4, 13.6, 16.2, 18.7, 19.4, 7.49, 8.5, 9.17, 10.5, 10.8, 11.4, 12.6, 13.8, 16.5, 19, 19.7, 8.27, 9.39, 10.1, 11.6, 11.9, 12.6, 14, 15.3, 18.3, 21.1, 21.9, 6.41, 8.38, 9.52, 10.3, 11.7, 12.1, 12.8, 14.2, 15.5, 18.6, 21.4, 22.2, 6.43, 8.4, 9.55, 10.3, 11.8, 12.1, 12.8, 14.2, 15.5, 18.6, 21.5, 22.3, 7.13, 9.32, 10.6, 11.4, 13.1, 13.5, 14.3, 15.8, 17.3, 20.8, 24, 24.9, 9.94, 11.3, 12.2, 13.9, 14.4, 15.2, 16.9, 18.5, 22.2, 25.7, 26.7, 7.69, 10.1, 11.4, 12.4, 14.1, 14.6, 15.4, 17.1, 18.7, 22.5, 26.1, 27.1, 10.3, 11.7, 12.7, 14.5, 14.9, 15.8, 17.5, 19.2, 23.1, 26.8, 27.8, 8.85, 11.6, 13.2, 14.3, 16.3, 16.8, 17.8, 19.8, 21.7, 26.2, 30.4, 31.5, 34.2, 37.8, 44.1, 8.87, 11.6, 13.2, 14.3, 16.4, 16.9, 17.9, 19.8, 21.7, 26.2, 30.4, 31.6, 9.08, 11.9, 13.5, 14.6, 16.7, 17.3, 18.3, 20.3, 22.3, 10.1, 13.3, 15.2, 16.4, 18.7, 19.3, 20.5, 22.8, 25, 30.2, 35.1, 36.5, 13.6, 15.5, 16.7, 19.2, 19.8, 20.9, 23.3, 25.5, 30.9, 35.9, 37.4, 40.6, 45, 52.7, 11.3, 14.8, 16.9, 18.2, 20.9, 21.5, 22.8, 25.4, 27.8, 33.8, 39.3, 40.9, 44.5, 49.3, 11.6, 15.3, 17.4, 18.8, 21.6, 22.3, 23.6, 26.2, 28.8, 34.9, 40.7, 42.3, 46.1, 51.1, 60.1, 13.2, 17.3, 19.8, 21.4, 24.5, 25.3, 26.8, 29.8, 32.8, 39.8, 46.5, 48.4, 52.7, 58.5, 69.2, 18, 20.5, 22.2, 25.5, 26.3, 27.9, 31, 34.1, 14.5, 19, 21.7, 23.5, 26.9, 27.8, 29.5, 32.8, 36.1, 43.9, 51.2, 53.4, 58.2, 64.7, 14.7, 19.4, 22.1, 23.9, 27.4, 28.3, 30, 33.4, 36.7, 44.7, 52.2, 54.4, 59.3, 66, 78.2, 14.8, 19.5, 22.2, 24, 27.6, 28.4, 30.2, 33.6, 36.9, 45, 52.5, 54.7, 59.7, 66.4, 78.7, 16.3, 21.5, 24.6, 26.6, 30.5, 31.5, 33.4, 37.2, 40.9, 49.9, 58.3, 60.8, 23.4, 26.7, 28.9, 33.2, 34.2, 36.4, 40.5, 44.6, 54.4, 63.7, 66.4, 72.5, 80.9, 96.3, 113, 24.2, 27.6, 29.8, 34.3, 35.4, 37.6, 41.9, 46.1, 56.2, 65.9, 68.7, 75.1, 83.7, 99.8, 26.6, 30.3, 32.8, 37.7, 38.9, 41.4, 46.1, 50.8, 62, 72.7, 75.9, 82.9, 92.6, 111, 29.4, 33.6, 36.3, 41.8, 43.1, 45.8, 51.1, 56.2, 68.8, 80.8, 84.3, 92.2, 103, 123, 146, 34.9, 39.9, 43.2, 49.7, 51.3, 54.5, 60.8, 67.1, 82.2, 96.6, 101, 111, 124, 149, 177, 35.1, 40.1, 43.4, 50, 51.6, 54.8, 61.2, 67.4, 82.6, 97.2, 101, 111, 125, 150, 178, 29, 38.2, 43.7, 47.3, 54.5, 56.3, 59.8, 66.8, 73.6, 90.3, 106, 111, 122, 136, 164, 40.7, 46.6, 50.4, 58.1, 60, 63.7, 71.2, 78.5, 96.3, 113, 119, 60.8, 64.6, 72.2, 79.6, 97.7, 115, 120, 132, 148, 53, 61, 63, 67, 74.8, 82.5, 101.3, 119.4, 124.7, 53.1, 61.1, 63.1, 67.1, 74.9, 82.6, 101, 120, 53.2, 61.3, 63.3, 67.2, 75.1, 82.8, 102, 120, 125, 137, 154, 186, 222, 70.8, 75.3, 84.1, 92.8, 114, 135, 141, 154, 173, 209, 84.4, 89.7, 100, 111, 136, 161, 168, 185, 208, 252, 303, 90.1, 95.8, 107, 118, 146, 172, 180, 198, 223, 109, 115, 129, 143, 176, 208, 218, 240, 270, 328, 397, 179, 221, 262, 274, 301, 340, 415, 503, 224, 277, 329, 344, 379, 429, 524, 637, 277, 329, 344, 380, 429, 525, 638, 318, 393, 468, 490, 540, 612, 751, 917, 1025, 1136, 434, 516, 540, 596, 675, 829, 476, 566, 593, 655, 742, 912, 1117, 1250, 1387, 625, 745, 780, 862, 978
];

    var CHSInercias = [0.23, 0.281, 0.306, 0.321, 0.46, 0.571, 0.629, 0.664, 0.727, 0.741, 0.768, 0.963, 1.07, 1.13, 1.25, 1.28, 0.969, 1.22, 1.36, 1.44, 1.6, 1.63, 1.1, 1.39, 1.55, 1.64, 1.82, 1.87, 1.37, 1.73, 1.93, 2.06, 2.29, 2.35, 1.68, 2.13, 2.38, 2.54, 2.83, 2.9, 1.97, 2.51, 2.81, 3, 3.36, 3.44, 3.6, 3.91, 4.19, 2.22, 2.83, 3.17, 3.39, 3.8, 3.89, 4.08, 4.43, 4.76, 2.75, 3.52, 3.96, 4.23, 4.75, 4.87, 5.12, 5.57, 5.99, 2.87, 3.68, 4.13, 4.41, 4.96, 5.09, 5.34, 5.82, 6.26, 7.22, 3.11, 3.99, 4.48, 4.8, 5.39, 5.53, 5.81, 6.34, 6.82, 3.37, 4.32, 4.86, 5.2, 5.85, 6.01, 6.31, 6.88, 7.42, 3.78, 4.85, 5.46, 5.85, 6.59, 6.76, 7.11, 7.77, 8.38, 3.92, 5.04, 5.67, 6.07, 6.84, 7.03, 7.39, 8.08, 8.71, 4.04, 5.19, 5.84, 6.26, 7.06, 7.25, 7.62, 8.33, 8.99, 10.5, 11.7, 12, 4.69, 6.04, 6.81, 7.3, 8.24, 8.46, 8.91, 9.75, 10.5, 4.85, 6.26, 7.05, 7.56, 8.54, 8.77, 9.23, 10.1, 10.9, 12.8, 14.3, 14.7, 5.93, 7.66, 8.64, 9.28, 10.5, 10.8, 11.4, 12.5, 13.5, 6.04, 7.81, 8.81, 9.46, 10.7, 11, 11.6, 12.7, 13.8, 16.2, 18.2, 18.7, 6.16, 7.96, 8.99, 9.65, 10.9, 11.2, 11.8, 13, 14, 8.38, 9.46, 10.2, 11.5, 11.8, 12.5, 13.7, 14.8, 17.4, 6.73, 8.7, 9.83, 10.6, 11.9, 12.3, 12.9, 14.2, 15.4, 18.1, 20.4, 21.1, 7.15, 9.26, 10.5, 11.2, 12.7, 13.1, 13.8, 15.1, 16.4, 19.3, 21.9, 22.5, 7.59, 9.83, 11.1, 11.9, 13.5, 13.9, 14.7, 16.1, 17.5, 20.6, 23.3, 24.1, 9.03, 11.7, 13.2, 14.2, 16.2, 16.6, 17.5, 19.3, 21, 24.8, 28.1, 29.1, 12.4, 10.1, 13.1, 14.8, 15.9, 18.1, 18.6, 19.6, 21.6, 23.5, 27.9, 31.7, 32.7, 13.8, 15.6, 16.8, 19.1, 19.7, 20.8, 22.9, 24.9, 29.5, 33.6, 34.7, 11.8, 15.3, 17.4, 18.7, 21.3, 21.9, 23.1, 25.5, 27.7, 32.9, 37.6, 38.8, 12, 15.6, 17.7, 19, 21.6, 22.2, 23.5, 25.9, 28.2, 33.5, 38.2, 39.5, 16.6, 18.8, 20.2, 23, 23.6, 25, 27.5, 30, 35.7, 40.8, 42.2, 13.1, 17, 19.2, 20.7, 23.6, 24.3, 25.6, 28.3, 30.8, 17.2, 19.4, 20.9, 23.8, 24.5, 25.9, 28.6, 31.1, 37, 42.3, 43.8, 13.7, 17.8, 20.2, 21.8, 24.8, 25.5, 26.9, 29.7, 32.4, 38.6, 44.1, 45.7, 14, 18.3, 20.7, 22.3, 25.4, 26.2, 27.6, 30.5, 33.2, 39.6, 45.3, 46.9, 20.6, 23.4, 25.2, 28.7, 29.5, 31.2, 34.5, 37.6, 44.9, 51.4, 53.2, 22.6, 18.9, 24.7, 28.1, 30.2, 34.5, 35.5, 37.5, 41.5, 45.3, 54.2, 62.3, 64.6, 26.4, 30, 32.3, 36.8, 37.9, 40.1, 44.4, 48.5, 58.1, 66.8, 69.2, 27, 30.6, 33, 37.6, 38.8, 41, 45.4, 49.6, 59.4, 68.3, 70.8, 31.2, 35.5, 38.2, 43.6, 45, 47.6, 52.7, 57.6, 69.1, 79.7, 82.7, 24.4, 31.8, 36.2, 39, 44.6, 45.9, 48.6, 53.8, 58.8, 70.6, 81.4, 84.5, 24.5, 32, 36.3, 39.2, 44.7, 46.1, 48.8, 54, 59.1, 70.9, 81.8, 84.8, 28.5, 37.3, 42.4, 45.7, 52.3, 53.9, 57, 63.2, 69.1, 83.2, 96.1, 99.8, 41, 46.6, 50.3, 57.5, 59.3, 62.8, 69.6, 76.2, 91.8, 106, 110, 31.9, 41.8, 47.5, 51.3, 58.6, 60.4, 64, 70.9, 77.6, 93.6, 108, 112, 43.3, 49.3, 53.2, 60.8, 62.7, 66.4, 73.6, 80.6, 97.2, 112, 117, 39.3, 51.6, 58.7, 63.4, 72.5, 74.8, 79.2, 87.9, 96.3, 116, 135, 140, 152, 168, 196, 39.5, 51.7, 58.9, 63.6, 72.8, 75, 79.5, 88.2, 96.7, 117, 135, 141, 40.8, 53.6, 61, 65.8, 75.3, 77.7, 82.3, 91.3, 100, 48.2, 63.2, 72, 77.8, 89.1, 91.8, 97.3, 108, 119, 144, 167, 174, 65.3, 74.3, 80.3, 92, 94.9, 101, 112, 123, 148, 173, 179, 195, 216, 253, 56.3, 74, 84.3, 91.1, 104, 108, 114, 127, 139, 169, 196, 204, 222, 246, 59.1, 77.6, 88.5, 95.6, 110, 113, 120, 133, 146, 177, 207, 215, 234, 260, 305, 71.2, 93.6, 107, 115, 132, 136, 145, 161, 177, 215, 251, 261, 285, 316, 373, 99, 113, 122, 140, 144, 153, 170, 187, 82, 107, 123, 133, 152, 157, 166, 185, 204, 248, 290, 302, 329, 366, 83.9, 110, 126, 136, 156, 161, 171, 190, 209, 255, 298, 310, 338, 376, 446, 84.6, 111, 127, 137, 158, 163, 172, 192, 211, 257, 300, 313, 341, 379, 450, 98, 129, 147, 159, 183, 189, 200, 223, 245, 299, 350, 365, 146, 167, 181, 207, 214, 227, 253, 279, 340, 398, 415, 453, 506, 602, 708, 153, 175, 190, 218, 225, 239, 266, 293, 357, 418, 436, 477, 532, 634, 177, 202, 218, 251, 259, 275, 307, 338, 412, 484, 504, 552, 616, 736, 205, 234, 254, 292, 301, 320, 357, 393, 481, 564, 589, 644, 720, 862, 1020, 265, 303, 328, 378, 390, 414, 462, 510, 624, 735, 767, 840, 941, 1130, 1343, 267, 306, 331, 381, 393, 418, 466, 514, 630, 741, 773, 847, 949, 1140, 1355, 230, 304, 348, 376, 433, 447, 475, 531, 585, 718, 845, 882, 967, 1085, 1305, 334, 382, 414, 476, 492, 523, 584, 644, 790, 931, 972, 502, 533, 596, 657, 807, 950, 992, 1088, 1221, 445, 513, 529, 563, 628, 693, 851, 1003, 1048, 446, 514, 530, 564, 630, 695, 853, 1005, 448, 515, 532, 566, 632, 697, 856, 1009, 1053, 1156, 1297, 1564, 1868, 629, 669, 748, 825, 1014, 1196, 1250, 1372, 1541, 1862, 817, 869, 972, 1073, 1320, 1560, 1630, 1791, 2016, 2442, 2934, 901, 958, 1071, 1183, 1457, 1722, 1800, 1979, 2227, 1189, 1265, 1415, 1564, 1928, 2282, 2386, 2626, 2960, 3598, 4345, 2186, 2699, 3199, 3346, 3686, 4160, 5073, 6147, 3058, 3781, 4487, 4696, 5177, 5852, 7154, 8697, 3785, 4492, 4701, 5183, 5858, 7162, 8707, 5143, 6369, 7572, 7929, 8753, 9910, 12158, 14847, 16599, 18390, 7364, 8758, 9172, 10128, 11472, 14087, 8464, 10071, 10547, 11650, 13201, 16223, 19852, 22227, 24663, 12701, 15128, 15849, 17519, 19874
];

    var CHSPesos = [0.581, 0.75, 0.845, 0.906, 0.732, 0.952, 1.08, 1.16, 1.32, 1.35, 0.869, 1.13, 1.29, 1.39, 1.58, 1.63, 0.94, 1.23, 1.4, 1.5, 1.72, 1.77, 0.98, 1.28, 1.46, 1.57, 1.8, 1.85, 1.05, 1.38, 1.57, 1.7, 1.94, 2, 1.13, 1.48, 1.68, 1.82, 2.08, 2.15, 1.19, 1.56, 1.78, 1.92, 2.2, 2.27, 2.41, 2.67, 2.93, 1.24, 1.63, 1.85, 2, 2.3, 2.37, 2.51, 2.79, 3.06, 1.33, 1.75, 2, 2.16, 2.47, 2.55, 2.71, 3.01, 3.3, 1.35, 1.78, 2.02, 2.19, 2.51, 2.59, 2.75, 3.05, 3.35, 4.07, 1.39, 1.82, 2.08, 2.25, 2.58, 2.66, 2.83, 3.14, 3.45, 1.42, 1.87, 2.14, 2.31, 2.65, 2.74, 2.9, 3.23, 3.55, 1.48, 1.95, 2.22, 2.4, 2.76, 2.85, 3.02, 3.36, 3.7, 1.5, 1.97, 2.25, 2.44, 2.8, 2.89, 3.06, 3.41, 3.75, 1.51, 1.99, 2.27, 2.46, 2.82, 2.91, 3.09, 3.44, 3.79, 4.61, 5.39, 5.61, 1.59, 2.1, 2.39, 2.59, 2.98, 3.07, 3.26, 3.63, 4, 1.61, 2.12, 2.42, 2.62, 3.01, 3.11, 3.3, 3.68, 4.04, 4.93, 5.77, 6.01, 1.72, 2.27, 2.59, 2.81, 3.23, 3.33, 3.54, 3.94, 4.34, 1.73, 2.28, 2.61, 2.82, 3.25, 3.35, 3.56, 3.97, 4.37, 5.34, 6.26, 6.53, 1.74, 2.3, 2.63, 2.84, 3.27, 3.37, 3.58, 4, 4.4, 2.34, 2.67, 2.89, 3.33, 3.43, 3.65, 4.07, 4.48, 5.47, 1.79, 2.37, 2.71, 2.93, 3.37, 3.48, 3.69, 4.12, 4.54, 5.55, 6.51, 6.79, 1.83, 2.42, 2.76, 2.99, 3.44, 3.55, 3.77, 4.21, 4.64, 5.67, 6.66, 6.94, 1.87, 2.47, 2.82, 3.05, 3.51, 3.63, 3.85, 4.3, 4.74, 5.8, 6.81, 7.1, 1.98, 2.61, 2.99, 3.24, 3.73, 3.85, 4.09, 4.56, 5.03, 6.17, 7.25, 7.57, 2.66, 2.05, 2.71, 3.1, 3.36, 3.87, 4, 4.25, 4.74, 5.23, 6.41, 7.55, 7.88, 2.76, 3.16, 3.42, 3.94, 4.07, 4.32, 4.83, 5.33, 6.54, 7.69, 8.03, 2.16, 2.86, 3.27, 3.55, 4.08, 4.22, 4.48, 5.01, 5.52, 6.78, 7.99, 8.34, 2.18, 2.88, 3.29, 3.56, 4.11, 4.24, 4.51, 5.03, 5.55, 6.82, 8.03, 8.39, 2.93, 3.36, 3.64, 4.19, 4.33, 4.6, 5.14, 5.67, 6.97, 8.21, 8.58, 2.24, 2.96, 3.39, 3.67, 4.23, 4.37, 4.64, 5.18, 5.72, 2.97, 3.4, 3.68, 4.24, 4.38, 4.66, 5.2, 5.74, 7.05, 8.32, 8.69, 2.28, 3.01, 3.44, 3.73, 4.3, 4.44, 4.72, 5.27, 5.82, 7.15, 8.43, 8.81, 2.29, 3.03, 3.47, 3.76, 4.33, 4.48, 4.76, 5.32, 5.87, 7.21, 8.51, 8.89, 3.16, 3.61, 3.92, 4.51, 4.66, 4.96, 5.54, 6.12, 7.52, 8.88, 9.28, 3.26, 2.53, 3.35, 3.84, 4.16, 4.8, 4.96, 5.27, 5.9, 6.51, 8.01, 9.47, 9.9, 3.43, 3.93, 4.25, 4.91, 5.07, 5.39, 6.03, 6.66, 8.2, 9.69, 10.1, 3.45, 3.95, 4.28, 4.94, 5.1, 5.43, 6.07, 6.71, 8.26, 9.77, 10.2, 3.63, 4.15, 4.5, 5.19, 5.36, 5.71, 6.38, 7.05, 8.69, 10.3, 10.8, 2.76, 3.65, 4.18, 4.53, 5.23, 5.4, 5.75, 6.43, 7.1, 8.75, 10.4, 10.8, 2.76, 3.65, 4.19, 4.54, 5.24, 5.41, 5.75, 6.44, 7.11, 8.77, 10.4, 10.8, 2.9, 3.85, 4.41, 4.78, 5.51, 5.7, 6.06, 6.78, 7.5, 9.25, 10.9, 11.5, 3.97, 4.55, 4.93, 5.69, 5.88, 6.26, 7, 7.74, 9.56, 11.3, 11.8, 3.01, 4, 4.58, 4.96, 5.73, 5.92, 6.3, 7.05, 7.79, 9.62, 11.4, 11.9, 4.04, 4.63, 5.02, 5.8, 5.99, 6.38, 7.14, 7.89, 9.74, 11.5, 12.1, 3.23, 4.29, 4.91, 5.33, 6.15, 6.36, 6.76, 7.57, 8.38, 10.3, 12.3, 12.8, 14.1, 16, 19.5, 3.24, 4.29, 4.92, 5.33, 6.16, 6.36, 6.77, 7.58, 8.38, 10.4, 12.3, 12.8, 3.27, 4.34, 4.97, 5.39, 6.23, 6.44, 6.85, 7.67, 8.48, 3.46, 4.59, 5.26, 5.7, 6.59, 6.81, 7.24, 8.11, 8.98, 11.1, 13.2, 13.8, 4.64, 5.31, 5.76, 6.66, 6.88, 7.32, 8.2, 9.08, 11.2, 13.3, 13.9, 15.4, 17.4, 21.2, 3.64, 4.83, 5.54, 6.01, 6.94, 7.18, 7.64, 8.56, 9.47, 11.7, 13.9, 14.6, 16.1, 18.2, 3.7, 4.91, 5.63, 6.11, 7.06, 7.29, 7.77, 8.7, 9.63, 11.9, 14.1, 14.8, 16.3, 18.5, 22.6, 3.94, 5.23, 6, 6.5, 7.52, 7.77, 8.27, 9.27, 10.3, 12.7, 15.1, 15.8, 17.4, 19.7, 24.2, 5.33, 6.11, 6.63, 7.66, 7.92, 8.43, 9.45, 10.5, 4.12, 5.47, 6.28, 6.81, 7.87, 8.14, 8.67, 9.71, 10.8, 13.3, 15.8, 16.6, 18.3, 20.7, 4.16, 5.52, 6.34, 6.87, 7.95, 8.21, 8.74, 9.8, 10.9, 13.4, 16, 16.7, 18.5, 20.9, 25.6, 4.17, 5.54, 6.35, 6.89, 7.97, 8.23, 8.77, 9.83, 10.9, 13.5, 16, 16.8, 18.5, 21, 25.7, 4.38, 5.82, 6.68, 7.24, 8.37, 8.66, 9.22, 10.3, 11.4, 14.2, 16.9, 17.7, 6.07, 6.96, 7.55, 8.73, 9.03, 9.61, 10.8, 11.9, 14.8, 17.6, 18.4, 20.4, 23.1, 28.4, 34.7, 6.17, 7.07, 7.68, 8.88, 9.17, 9.77, 11, 12.1, 15, 17.9, 18.8, 20.7, 23.5, 28.9, 6.46, 7.41, 8.05, 9.3, 9.62, 10.2, 11.5, 12.7, 15.8, 18.8, 19.7, 21.8, 24.7, 30.3, 6.79, 7.79, 8.46, 9.78, 10.1, 10.8, 12.1, 13.4, 16.6, 19.8, 20.7, 22.9, 26, 32, 39.2, 7.4, 8.49, 9.22, 10.7, 11, 11.7, 13.2, 14.6, 18.1, 21.6, 22.6, 25, 28.4, 35, 43, 7.42, 8.51, 9.24, 10.7, 11.1, 11.8, 13.2, 14.6, 18.2, 21.7, 22.7, 25.1, 28.5, 35.1, 43.1, 5.83, 7.74, 8.89, 9.65, 11.2, 11.5, 12.3, 13.8, 15.3, 19, 22.6, 23.7, 26.2, 29.8, 36.7, 7.99, 9.17, 9.96, 11.5, 11.9, 12.7, 14.2, 15.8, 19.6, 23.4, 24.5, 12, 12.8, 14.3, 15.9, 19.7, 23.5, 24.7, 27.3, 31, 10.2, 11.8, 12.2, 13, 14.6, 16.2, 20.1, 24, 25.1, 10.2, 11.8, 12.2, 13, 14.6, 16.2, 20.1, 24, 10.2, 11.8, 12.2, 13, 14.6, 16.2, 20.1, 24, 25.2, 27.8, 31.6, 39, 48, 12.9, 13.8, 15.5, 17.1, 21.3, 25.4, 26.6, 29.5, 33.5, 41.4, 14.1, 15, 16.9, 18.7, 23.3, 27.8, 29.1, 32.2, 36.6, 45.3, 55.9, 14.6, 15.5, 17.4, 19.3, 24, 28.7, 30.1, 33.3, 37.9, 16, 17, 19.1, 21.2, 26.4, 31.5, 33.1, 36.6, 41.6, 51.6, 63.7, 23.7, 29.5, 35.3, 37, 41, 46.7, 57.8, 71.5, 26.5, 33, 39.5, 41.4, 45.9, 52.3, 64.9, 80.3, 33.1, 39.5, 41.5, 45.9, 52.3, 64.9, 80.3, 31.6, 39.3, 47, 49.3, 54.7, 62.3, 77.4, 96, 108, 121, 41.3, 49.4, 51.8, 57.4, 65.4, 81.3, 43.2, 51.7, 54.3, 60.2, 68.6, 85.2, 106, 120, 134, 49.5, 59.2, 62.2, 68.9, 78.6
];

    var CHS = new perfil(CHSNombres, CHSModulos, CHSInercias, CHSPesos);

    // Creamos un objeto de la clase viga para la viga a calcular
    var vigaCalculo = new viga();

    // Definimos las variables que van a albergar el nombre del perfil último y de servicio;
    var perfilUltimo;
    var perfilServicio;

    var error = '';

    // Obtenemos los datos de la web y los asignamos a nuestra viga a calcular
    vigaCalculo.setVigaData('luz', getAnswer('luz'));
    if (vigaCalculo.getVigaData('luz') < 0) {
        error += 'Ha introducido una luz negativa</br>';
    }

    vigaCalculo.setVigaData('faja', getAnswer('faja'));
    if (vigaCalculo.getVigaData('faja') < 0) {
        error += 'Ha introducido una faja de carga negativa</br>';
    }

    vigaCalculo.setVigaData('pesoPropio', getAnswer('pesoPropio'));
    if (vigaCalculo.getVigaData('pesoPropio') < 0) {
        error += 'Ha introducido un peso propio negativo</br>';
    }

    vigaCalculo.setVigaData('sobreCarga', getAnswer('sobrecarga'));
    if (vigaCalculo.getVigaData('sobreCarga') < 0) {
        error += 'Ha introducido una sobrecarga negativa</br>';
    }

    // El dato de la flecha límite lo obtenemos de la web y lo asignamos a nuestra viga a calcular
    var selectorFlecha = getAnswer('limite');
    switch (selectorFlecha) {
    case "Tabiques frágiles":
        vigaCalculo.setVigaData('flecha', 500);
        break;
    case "Tabiques ordinarios":
        vigaCalculo.setVigaData('flecha', 400);
        break;
    case "El resto de los casos":
        vigaCalculo.setVigaData('flecha', 300);
        break;
    }

    // Obtenemos la serie elegida y encontramos el perfil último y de servicio
    var selectorPerfil = getAnswer('perfil');
    switch (selectorPerfil) {
    case "IPE":
        cantoUltimo = IPE.encontrarPerfil(vigaCalculo.calculoModulo(), IPE.getModulo(), false);
        cantoServicio = IPE.encontrarPerfil(vigaCalculo.calculoInercia(), IPE.getInercia(), false);
        break;
    case "IPN":
        cantoUltimo = IPN.encontrarPerfil(vigaCalculo.calculoModulo(), IPN.getModulo(), false);
        cantoServicio = IPN.encontrarPerfil(vigaCalculo.calculoInercia(), IPN.getInercia(), false);
        break;
    case "CHS (tubo circular)":
        cantoUltimo = CHS.encontrarPerfil(vigaCalculo.calculoModulo(), CHS.getModulo(), false);
        cantoServicio = CHS.encontrarPerfil(vigaCalculo.calculoInercia(), CHS.getInercia(), false);
        pesoUltimo = CHS.encontrarPerfil(vigaCalculo.calculoModulo(), CHS.getModulo(), CHS.getPeso());
        pesoServicio = CHS.encontrarPerfil(vigaCalculo.calculoInercia(), CHS.getInercia(), CHS.getPeso());
        break;
    }
    
    if (cantoUltimo === 'No existe ningún perfil que soporte esa carga' && cantoServicio === 'No existe ningún perfil que soporte esa carga') {
        resultado = 'No existe ningún perfil que soporte esa carga';
    } else if (selectorPerfil !== "CHS (tubo circular)") {
        if (cantoUltimo === 'No existe ningún perfil que soporte esa carga' && cantoServicio !== 'No existe ningún perfil que soporte esa carga') {
            resultado = 'No existe ningún perfil que soporte esa carga a resistencia. </br>A deformación es necesario un <b>' + cantoServicio + '</b>.';
        } else if (cantoUltimo !== 'No existe ningún perfil que soporte esa carga' && cantoServicio === 'No existe ningún perfil que soporte esa carga') {
            resultado = 'A resistencia es necesario un <b>' + cantoUltimo + '</b>. </br>No existe ningún perfil que soporte esa carga a deformación';
        } else if (error !== '') {
            resultado = error;
        } else {
            resultado = 'A resistencia es necesario un <b>' + cantoUltimo + '</b>. </br>A deformación es necesario un <b>' + cantoServicio + '</b>.';
        }
    } else {
        if (cantoUltimo === 'No existe ningún perfil que soporte esa carga' && cantoServicio !== 'No existe ningún perfil que soporte esa carga') {
            resultado = 'No existe ningún perfil que soporte esa carga a resistencia. </br>A deformación y con menor peso es necesario un <b>' + pesoServicio + '</b>,</br>y a deformación y con menos canto es necesario un <b>' + perfilServicio[0] + '</b>.';
        } else if (cantoUltimo !== 'No existe ningún perfil que soporte esa carga' && cantoServicio === 'No existe ningún perfil que soporte esa carga') {
            resultado = 'A resistencia y con menos peso es necesario un <b>' + pesoUltimo + '</b>,</br>y a resistencia y con menos canto es necesario un <b>' + cantoUltimo + '</b>. </br>No existe ningún perfil que soporte esa carga a deformación';
        } else if (error !== '') {
            resultado = error;
        } else {
            resultado = 'A resistencia y con menos peso es necesario un <b>' + pesoUltimo + '</b>,</br>y a resistencia y con menos canto es necesario un <b>' + cantoUltimo + '</b>.</br>A deformación y con menos peso es necesario un <b>' + pesoServicio + '</b>,</br>y a deformación y con menos canto es necesario un <b>' + cantoServicio + '</b>.';
        }
    }
    return resultado;
}