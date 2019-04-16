##############################################################################
# GERAL
##############################################################################

O aplicativo SASJS para pesquisa de poços foi desenvolvido utilizando-se as seguintes tecnologias: 
Framework DOJO em javascript, CSS3, HTML5 e a API para Javascript da Esri.



##############################################################################
# INSTALAÇÃO
##############################################################################

Este componente utiliza a API ESRI Javascript e pode ser utilizado com o acesso aos arquivos da API disponíveis nos servidores da ESRI ou com os arquivos armazenados localmente.


------------------------------------------------------------------------------
# Utilizando os servidores da ESRI
------------------------------------------------------------------------------
Acrescente os seguintes scripts à página HTML.
	<link rel="stylesheet" href="http://js.arcgis.com/3.8/js/esri/css/esri.css">
    <link rel="stylesheet" href="http://js.arcgis.com/3.8/js/dojo/dijit/themes/tundra/tundra.css"/>
    <script src="http://js.arcgis.com/3.8/init.js"></script>

------------------------------------------------------------------------------
# Utilizado os arquivos em seu próprio servidor
------------------------------------------------------------------------------
Acesse o site http://www.esri.com/apps/products/download/ e clique sobre a versão 3.8 da API Javascript.
É necessário realizar um cadastro no próprio site.


Copie os arquivos para o servidor WEB.

Edite os arquivos:

- arcgis_js_api\library\3.8\3.8\init.js e
- arcgis_js_api\library\3.8\3.8\js\dojo\dojo\dojo.js

Procure pelo texto '[HOSTNAME_AND_PATH_TO_JSAPI]' e substitua-o pelo caminho da instalação da aplicação SASJS.

Insira as tags para carregamento dos seguintes arquivos na página onde será carregada a aplicação.

Onde [HOSTNAME_AND_PATH_TO_JSAPI] é o caminho do seu servidor onde está a api do Javascript ArcGIS

<link rel="stylesheet" href="http://[HOSTNAME_AND_PATH_TO_JSAPI]/arcgis_js_api/library/3.8/3.8/js/esri/css/esri.css">
<link rel="stylesheet" href="http://[HOSTNAME_AND_PATH_TO_JSAPI]/arcgis_js_api/library/3.8/3.8/js/dojo/dijit/themes/tundra/tundra.css"/>
<script src="http://[HOSTNAME_AND_PATH_TO_JSAPI]/arcgis_js_api/library/3.8/3.8/"></script>

------------------------------------------------------------------------------
# Utilizando o componente
------------------------------------------------------------------------------

Carregue os seguintes arquivos na página HTML.
    
	<link rel="stylesheet" href="css/font-awesome/css/font-awesome.min.css"/>
    <link rel="stylesheet" href="http://js.arcgis.com/3.8/js/esri/css/esri.css">
    <link rel="stylesheet" href="http://js.arcgis.com/3.8/js/dojo/dijit/themes/tundra/tundra.css"/>
    <link rel="stylesheet" href="lib/agsjs/css/agsjs.css"/>
    <link rel="stylesheet" href="css/bootstrap.css" />
    <link rel="stylesheet" href="css/geral.css">
    <script src="app/config.js"></script>
    <script src="http://js.arcgis.com/3.8/init.js"></script>
	
	

Após o carregamento dos arquivos acima deve-se instanciar a aplicação e executar o método init conforme o código abaixo:

<script>
 require([

	/* dependencias que devem ser carregadas para execução da aplicação */ 

            'dojo/on',
            'app/sasjs',
            'app/app-helper',
            'esri/geometry/Point',
            'esri/SpatialReference'
        ], function (on, SASJS, AppHelper, Point, SpatialReference) {

	/* objeto que executa a aplicação */

            var app = new SASJS();
	
	
	/* Carrega as configurações do SASJS */
            app.loadConfig('configuracoes.json');

	/* Inicializa a aplicação na DIV passada como parâmetro da função */
            app.init('sasjs');
});
</script>


##############################################################################
# CONFIGURAÇÃO
##############################################################################

Existem dois arquivos em formato json que são utilizados na configuração da aplicação: 
- config.js que está localizado na pasta app e que configura a aplicação como um todo (não precisa de alteração).

- configuracoes.json que configura os widgets (ferramentas), plugins, extensão inicial do mapa e mapa de base da aplicação.


------------------------------------------------------------------------------
# WIDGETS
------------------------------------------------------------------------------

São as ferramentas disponíveis na aplicação. Cada ferramenta pode ser personalizada e configurada através de parâmetros específicos.

+++++++++++++++++++++++++++++++
+ well-registry-manager
+++++++++++++++++++++++++++++++

Esse widget é utilizado na inserção e edição de POÇOS e os arquivos que compoem o widgets são: 

 - app/template/well-registry-manager.html (template em HTML e CSS do widget)
 - app/widgets/well-registry-manager/main.js (arquivo principal do widget)
 - app/spatial-location-form.js (cria formulário com campos parar informar a localização geografica)

Utiliza o widget GMS para inserção de Grau Minuto e Segundo utilizado na visualização da posição do ponto, arquivos:

 - app/template/gms.html
 - app/widgets/gms/gms.js

A configuração do widget no json são as seguintes: 

 - position (left ou right):	define se a posição do widget sobre o mapa a esquerda ou direita
 - showLocateButton             (true ou false) Exibe ou esconde o botão de Localizar
 - geometryServiceURL: 			URL dos serviços geometricos utilizados no widget
 - Service:						id, name e url dos serviços utilizados pelo widget
 - projections/geographic		label e value (na esri se chama WKID que identifica a projeção) das projeções geograficao
 - projectios/projected			label e value (na esri se chama WKID que identifica a projeção) das projeções projetadas

+++++++++++++++++++++++++++++++
+ search
+++++++++++++++++++++++++++++++

Faz a pesquisa nos serviços para localizar os poços de acordo com os parâmetros passados pelo widget, arquivos do widget:

 - app/template/search.html
 - app/widgets/search/search.js

A configuração do widget no json são as seguintes: 

 - position (left ou right):		define se a posição do widget sobre o mapa a esquerda ou direita
 - config/services					id, name e URL dos serviços de rest utilizados no widget para preencher os combos

- Eventos :
    -- 'state-defined' : evento disparado ao o comboBox de "Estados" ser preenchido com as feições carregadas do serviço;
    -- 'city-defined' : evento disparado ao o comboBox de "Município" ser preenchido com as feições carregadas do serviço;
    -- 'province-defined' : evento disparado ao o comboBox de "Província / Subprovíncia Hidrogeológica" ser preenchido com as feições carregadas do serviço;
    -- 'aquifer-defined' : evento disparado ao o comboBox de "Aquífero" ser preenchido com as feições carregadas do serviço;
    -- 'regionRiverSystem-defined' : evento disparado ao o comboBox de "Região Hidrográfica (N1)" ser preenchido com as feições carregadas do serviço;
    -- 'unitRiverSystem-defined' : evento disparado ao o comboBox de "Região Hidrográfica (N2)" ser preenchido com as feições carregadas do serviço;
    -- 'localManagement-defined' : evento disparado ao o comboBox de "Unidade de Gestão Local (N3)" ser preenchido com as feições carregadas do serviço;
    -- 'stateManagement-defined' : evento disparado ao o comboBox de "Unidade de Gestão Estadual" ser preenchido com as feições carregadas do serviço.
    * Exemplo de uso : on(searchParams, 'stateManagement-defined', callback);

 
+++++++++++++++++++++++++++++++
+ toc-tree-widget
+++++++++++++++++++++++++++++++

Esse widget representa a tabela de conteúdos (lista de serviços), onde poderá selecionar as camadas que serão projetadas sobre o mapa


 - app/template/toc-tree-widget-view.html
 - app/widgets/toc-tree-widget/main.js

A configuração do widget no json são as seguintes:

 - open (true ou false)				faz com que o widget apareça aberto ou nao na abertura da aplicação
 - titleEnabled (true ou false)		habilita ou nao a visualização do titulo
 - urlServices
	- title: titulo do serviço
	- type: tipo da camada
	- url: caminho do serviço
	- legendsEnabled: ativar e desativar as legendas do t
	- subLayers (sub camadas)
		- id: idetificação da subcamada
		- label: rotulo da subcamada
	- visibleLayers[1,2,3]			selecionar quais camadas estarão visiveis na inicialização da aplicação


+++++++++++++++++++++++++++++++
+ draw-tool-widget
+++++++++++++++++++++++++++++++

Habilita a criação de geometrias sobre o mapa

 - app/template/draw-tool-widget-view.html	
 - app/widget/draw-tool-widget/main.js

- Métodos:
--> setSymbolPoint(type, options) Método utilizado para definir uma customização para o desenho de ponto
Parâmetros :
- type: 'simple' para uma simbologia simples  ou 'image' para uma simbologia de imagem
- options: um objeto contendo propriedades referente ao tipo de simbologia escolhido
    - propriedades para o tipo 'simple' :
        -- style (String) : configura o estilo da simbologia de marcação feita pelo ponto, tendo as opções: 'circle', 'cross', 'diamond', 'square', 'x';
        -- size (Number) : tamanho da marcação;
        -- outline (Object) : um objeto contendo as propriedades: style, size e color;
        -- color (String|Array) : utilize uma string contendo um valor representando um hexadecimal ou, utilize um array contendo um valor no formato RGB.
    - propriedades para o tipo 'image' :
        -- url (String) : local de onde será carregado a imagem;
        -- width (Number) : largura da imagem;
        -- height (Number) : altura da imagem.

- Eventos do Componente:
--> 'draw-end' : evento disparado sempre que um desenho for concluído
* exemplo de utilização: on(DrawTool, 'draw-end', callback)

- A configuração do widget no json são as seguintes:

 - limitGraphics(true ou false)		limita a quantidade de desenhos, true: somente um desenho, false: vários desenhos
 - symbolPoint(Object) : símbologia padrão para o desenho de ponto
    - Propriedades :
        - type: 'simple' para uma simbologia simples  ou 'image' para uma simbologia de imagem
        - As outras propriedades devem ser escolhidas de acordo com o 'type' escolhido:
            - propriedades para o tipo 'simple' :
                -- style (String) : configura o estilo da marcação feita pelo ponto, tendo as opções: 'circle', 'cross', 'diamond', 'square', 'x';
                -- size (int) : tamanho da marcação;
                -- outline (Object) : um objeto contendo as propriedades: style, size e color
                -- color (String|Array) : utilize uma string contendo um valor representando um hexadecimal ou, utilize um array contendo um valor no formato RGB.
            - propriedades para o tipo 'image' :
                -- url (String) : local onde de onde será carregado a imagem;
                -- width (Number) : largura da imagem;
                -- height (Number) : altura da imagem.


+++++++++++++++++++++++++++++++
+ change-basemap
+++++++++++++++++++++++++++++++

Possibilita alterar o mapa base da aplicação

 - app/template/change-basemap.html
 - app/widget/change-map/main.js

A configuração do widget no json são as seguintes:

 - open                     (true ou false) faz com que o widget apareça aberto ou não na abertura da aplicação
 - showArcGISBasemaps       (true ou false) habilita ou não a visualização dos mapas bases do ArcGIS
 - showCustomMap            (true ou false) habilita ou não a visualização dos mapas customizados
 - baseMaps
    - url: url do mapa base
    - thumbnailUrl: Imagem pequena do mapa base tamanho (200px x 133px)
    - title: Título do mapa base


+++++++++++++++++++++++++++++++
+ coordinate
+++++++++++++++++++++++++++++++

Pega, transforma e exibe as coordenadas de acordo com o DATUM selecionado

 - lib/proj4js/
 - app/template/coordinate.html
 - app/widget/coordinate/main.js

A configuração do widget no json são as seguintes:

 - open                     (true ou false) faz com que o widget apareça aberto ou não na abertura da aplicação
 - datum                    (Object) Todos os datums do select. Para deixar um campo por default adicionar {"selected" : true}
 - projection               (Object) Select com as opções Lat/Lon ou UTM. Para deixar um campo por default adicionar {"selected" : true}
 - format                   (Object) Select com as opções de formato Grau decimal ou DMS. Para deixar um campo por default adicionar {"selected" : true}
 - definition               (Object) Definição do Datum


------------------------------------------------------------------------------
- PLUGINS
------------------------------------------------------------------------------

 São as ferramentas não visuais disponíveis na aplicação. Cada ferramenta pode ser personalizada e configurada.

+++++++++++++++++++++++++++++++
+ validatePoint
+++++++++++++++++++++++++++++++

 Métodos:

--> Método validate({...}) :
 Valida um ponto através de parâmetros passados para uma função, podendo esta validação ser do tipo layer ou geoprocessor. Este plugin consome dados de um serviço parametrizado para esta validação. A função validate deste plugin é estruturada para receber os paramêtros listados abaixo:
 
 * type : tipo de consumo
 ** Opções: 'layer' ou 'geoprocessor'
 ** Tipo : String

 * url  : url do serviço a ser consumido
 ** Tipo : String

 * pointCoordinates : coordenadas do ponto a ser analisado
 ** Opções: 'x', 'y' e opcionalmente 'spatialReference', caso este último não seja passado, o plugin usará o spatialReference do mapa
 ** Tipo : Object

 * gpParams (opcional) : parâmetros passados para a consulta feita a um GeoProcessor
 ** Observação : Para passar o ponto (que foi criado a partir das coordenadas) para algum parâmetro do GeoProcessamento, basta inserir o valor '%point%' como valor da chave/parametro do GeoProcessor.
 Ex: gpParams : {geometryPoint: '%point%'}
 ** Tipo : Object

 * success : função de callback caso a consulta ocorra com sucesso.
 ** Tipo : Function

 * error : função de callback caso ocorra um erro no consumo
 ** Tipo : Function

--> Método showPopup({...}) : 
Mostra um popup em um ponto parametrizado pela função. Podendo conter em seu conteúdo uma lista de chaves e valores listados. Os parametros passados são estes a seguir:

 * pointCoordinates : coordenadas do ponto onde será fixado um popup
 ** Opções: 'x', 'y' e opcionalmente 'spatialReference'
 ** Tipo : Object

 * title : título do popup
 ** Tipo : String

 * content : conteúdo a ser exibido no popup.
 ** Observação: Este parâmetro também aceita uma string contendo tags HTML
 ** Tipo: Object | String

+++++++++++++++++++++++++++++++
+ map-click
+++++++++++++++++++++++++++++++

 Retorna a posição do ponto na referência espacial SIRGAS 2000.

 Métodos:

 --> getValues(function (fn) {})  Função que retorna um objeto com (latitude, longitude e position)
 --> getLongitude()           Retorna o último ponto de Longitude armazenado
 --> getLatitude()            Retorna o último ponto de Latitude armazenado
 --> getPosition()            Retorna um objeto com o último ponto de Latitude e Longitude

+++++++++++++++++++++++++++++++ 
+ mapClickIdentify
+++++++++++++++++++++++++++++++

 Retorna a geometria de todas as camadas do ponto

 --> setIdentify(visibilidade, [url]) 	Configura o plugin para retornar as geometrias desejadas: 
					visibilidade: configura as camadas que devem retornar as geometrias: visible/invisible/all
					[url]: array com a url dos serviços que devem ser adicionados na consulta

 --> getValues(function)			Retorna uma função que pega todas as geometrias do ponto clicado em questão

+++++++++++++++++++++++++++++++ 
+ geometryQuery
+++++++++++++++++++++++++++++++

Plugin que permita receber como parâmetro uma geometria, condição (where) e url da camada a ser pesquisada retornando os objetos que satisfaçam os parâmetros


--> clearGraphics()			limpa os graficos na tela gerados pela consulta

--> getValues(function, url, where, geometry,zoom, showResults) Retorna uma função que pega todos os objetos da pesquisa em questão
				            	function: função de callback
						url: url do serviço
						where: consulta
						geometry: objeto Geometry da geometria onde deve ser feita a consulta
						zoom: true/false dá o zoom no extent da seleção que foi feita
						showResults: true/false mostra o graphic dos pontos da seleção feita



##############################################################################						
# OBTENDO INFORMAÇÕES DAS FERRAMENTAS
##############################################################################

Após a inicialização da aplicação, é possível escutar os seguintes eventos:

- SASJS.EVENT_CREATED_WIDGET
Disparado sempre que o widget é criado.

- SASJS.EVENT_CREATED_ALL_WIDGETS
Disparado após a criação de todos os widgets.

- SASJS.EVENT_APPLICATION_FAULT
Disparado se houver um erro de carregamento em algum widget.


Nas função de callback do evento é possível se obter uma instância do widget para em seguida se utilizar a função getData(), que irá retornar os objetos com as informações do widget
ex:

     <script>

            var wellManager,
                searchParams,
                searchGeometry,
                mapClickPlugin,
                mapIdentifyPlugin,
                geometryQueryPlugin,
                validatePoint;

            require([
                'dojo/on',
                'app/sasjs'
            ], function (on, SASJS) {
                var app = new SASJS();
                "use strict";
                function createdWidgetEventHandler(info) {
                    if (info.widgetName === 'well-registry-manager/main') {
                        wellManager = info.widget;
                        on(wellManager.spatialForm.locateButton, 'click', wellManagerLocateButton);
                    } else if (info.widgetName === 'search/main') {
                        searchParams = info.widget;
                    } else if (info.widgetName === 'draw-tool-widget/main') {
                        searchGeometry = info.widget;

                        on(searchGeometry, 'draw-end', drawEnd);

                        searchGeometry.setSymbolPoint('simple', {
                            style : 'diamond',
                            size : 10,
                                outline : {
                                style : 'solid',
                                size : 8,
                                color : [0, 102, 153, 0.5]
                            },
                            color : '#fff'
                        });
                    }
                }

                function createdAllWidgetsEventHandler() {
                    console.log('Todos os widgets foram criados');
                }

                // Função que será chamada ao clicar no botão Localizar do widget wellManager (Localização Espacial)
                function wellManagerLocateButton(fn) {
                    console.log(fn);
                }

                // Função que será chamada ao término de cada desenho feito
                function drawEnd (geometry) {
                    console.log(geometry);
                }

                // Função disparada ao criar cada plugin
                function createdPluginEventHandler (info) {
                    if (info.pluginName === "map-click/main") {
                        mapClickPlugin = info.plugin;
                    }

                    if (info.pluginName === "mapClickIdentify/MapClickIdentify") {
                        mapIdentifyPlugin = info.plugin;
                    }

                    if (info.pluginName === "geometryQuery/GeometryQuery") {
                        geometryQueryPlugin = info.plugin;
                    }

                    if (info.pluginName === 'validatePoint/main') {
                        validatePoint = info.plugin;
                    }
                }

                // Função disparada depois que todos os plugins foram disparados
                function createdAllPluginsEventHandler() {
                    console.log('Todos os plugins foram criados');
                }

                function applicationFaultEventHandler() {
                    console.log('Falha ao inicializar a aplicação');
                }

                app.loadConfig('configuracoes.json');
                app.init('sasjs');

                on(app, SASJS.EVENT_CREATED_WIDGET, createdWidgetEventHandler);
                on(app, SASJS.EVENT_CREATED_ALL_WIDGETS, createdAllWidgetsEventHandler);
                on(app, SASJS.EVENT_CREATED_PLUGIN, createdPluginEventHandler);
                on(app, SASJS.EVENT_CREATED_ALL_PLUGINS, createdAllPluginsEventHandler);
                on(app, SASJS.EVENT_APPLICATION_FAULT, applicationFaultEventHandler);
            });


            function onClickValidatePoint () {
                if (validatePoint) {
                    validatePoint.validate({
                        type : 'layer',
                        url : 'http://www.snirh.gov.br/arcgis/rest/services/SIP/Poco/MapServer',
                        pointCoordinates : {
                            x : -47.789448381401726,
                            y : -18.936668520667258
                        },
                        gpParams : {
                            geometryPoint : "%point%", //work
                            point : '% point %' //work
                        },
                        success : function (value) {
                            console.log('Values');
                            console.log(value);
                        },
                        error : function (erro) {
                            console.log(erro);
                        }
                    });

                    validatePoint.showPopup({
                        pointCoordinates : {
                            x : -47,
                            y : -15
                        },
                        title : 'Meu título',
                        content : {
                            name : 'ANA',
                            project : 'SASJS',
                            enterprise : 'Notoriun'
                        }
                    });
                }
            }

            function onClickSearchGeometry() {
                if (searchGeometry) {
                    var data = searchGeometry.getData();

                    searchGeometry.getDataSIRGAS2000(function (valor) {
                        console.log("Geometria");
                        console.log(valor);
                    });

                    geometryQueryPlugin.getValues(getValuesGeometryQuery, "http://www.snirh.gov.br/arcgis/rest/services/SIP/Poco/MapServer/0", "1=1", data[0], true, true);
                    function getValuesGeometryQuery (values) {
                        console.log("Objetos da Geometria");
                        console.log(values);
                    }
                }
            }

            function onClickSearchParams() {
                if (searchParams) {
                    console.log(searchParams.getData());
                }
            }

            function onClickGetInfo() {
                if (wellManager) {
                    wellManager.getData(4674, function (data) {
                        console.log(data);
                    });
                }
            }

            function onClickLoadInfo() {
                if (wellManager) {
                    wellManager.loadSpatialForm(function () {
                        console.log('carregou');
                    }, function () {
                        console.log('falhou');
                    });
                }
            }

            function onClickDrawWell() {
                if (searchParams) {
                    var points = [22366, 22367, 22368, 22370, 22337, 26865, 26866, 27640];
                    searchParams.getPocos(points, searchParams.data.wellUrl);
                }
            }

            function onClickMapPlugin() {
                if (mapClickPlugin.getActive() === true) {
                    console.log('Plugin desativado');
                    mapClickPlugin.setActive(false);
                } else if (mapClickPlugin.getActive() === false) {
                    console.log('Plugin ativado');
                    mapClickPlugin.setActive(true);
                }
                /**
                 * Função de callback
                 */
                mapClickPlugin.getValues(function (values) {
                    console.log(values);
                });
            }


            function onClickIdentifyPlugin() {
                var enabled = mapIdentifyPlugin.getActive();

                if (enabled === true){
                    mapIdentifyPlugin.setActive(false);
                } else {
                    mapIdentifyPlugin.setActive(true);
                    mapIdentifyPlugin.setIdentify('visible', []);
                    mapIdentifyPlugin.getValues(getValuesMapClickIdentify);

                    function getValuesMapClickIdentify (values) {
                        console.log(values);
                    }
                }

            }

            function onClickGeometryQuery() {
                geometryQueryPlugin.clearGraphics();
                geometryQueryPlugin.getValues(getValuesGeometryQuery, "http://www.snirh.gov.br/arcgis/rest/services/SIP/Estado/MapServer/0", "UFD_NM = 'SERGIPE'", "", true, true);
                function getValuesGeometryQuery (values) {
                    console.log("Objetos da Geometria");
                    console.log(values);
                }
            }

        </script>



