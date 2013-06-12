<?php
// @codingStandardsIgnoreFile
// @codeCoverageIgnoreStart
// this is an autogenerated file - do not edit
spl_autoload_register(
    function($class) {
        static $classes = null;
        if ($classes === null) {
            $classes = array(
                'accessdeniedauthenticator' => '/ludoDB/Tests/classes/AccessDeniedAuthenticator.php',
                'accessgrantedauthenticator' => '/ludoDB/Tests/classes/AccessGrantedAuthenticator.php',
                'accessortest' => '/ludoDB/Tests/AccessorTest.php',
                'achild' => '/ludoDB/Tests/classes/Dependencies/AChild.php',
                'acity' => '/ludoDB/Tests/classes/Dependencies/ACity.php',
                'allcarproperties' => '/ludoDB/Tests/classes/AllCarProperties.php',
                'anotherchild' => '/ludoDB/Tests/classes/Dependencies/AnotherChild.php',
                'aparent' => '/ludoDB/Tests/classes/Dependencies/AParent.php',
                'asibling' => '/ludoDB/Tests/classes/Dependencies/ASibling.php',
                'author' => '/ludoDB/examples/mod_rewrite/Author.php',
                'availableservicestest' => '/ludoDB/Tests/AvailableServicesTest.php',
                'book' => '/ludoDB/examples/mod_rewrite/Book.php',
                'bookauthor' => '/ludoDB/examples/mod_rewrite/BookAuthor.php',
                'bookauthors' => '/ludoDB/examples/mod_rewrite/BookAuthors.php',
                'brand' => '/ludoDB/Tests/classes/Brand.php',
                'cachetest' => '/ludoDB/Tests/CacheTest.php',
                'capital' => '/ludoDB/Tests/classes/JSONCaching/Capital.php',
                'capitals' => '/ludoDB/Tests/classes/JSONCaching/Capitals.php',
                'car' => '/ludoDB/Tests/classes/Car.php',
                'carcollection' => '/ludoDB/Tests/classes/CarCollection.php',
                'carproperties' => '/ludoDB/Tests/classes/CarProperties.php',
                'carproperty' => '/ludoDB/Tests/classes/CarProperty.php',
                'carswithproperties' => '/ludoDB/Tests/classes/CarsWithProperties.php',
                'chessprogressbar' => '/php-progress-bar/progress-bar.class.php',
                'city' => '/ludoDB/Tests/classes/City.php',
                'client' => '/ludoDB/Tests/classes/Client.php',
                'collectiontest' => '/ludoDB/Tests/CollectionTest.php',
                'columnaliastest' => '/ludoDB/Tests/ColumnAliasTest.php',
                'configparsertest' => '/ludoDB/Tests/ConfigParserTest.php',
                'configparsertestjson' => '/ludoDB/Tests/ConfigParserTestJSON.php',
                'democities' => '/ludoDB/examples/cities/DemoCities.php',
                'democity' => '/ludoDB/examples/cities/DemoCity.php',
                'democountries' => '/ludoDB/examples/cities/DemoCountries.php',
                'democountry' => '/ludoDB/examples/cities/DemoCountry.php',
                'demostate' => '/ludoDB/examples/cities/DemoState.php',
                'demostates' => '/ludoDB/examples/cities/DemoStates.php',
                'fileupload' => '/resources/FileUpload.php',
                'forsqltest' => '/ludoDB/Tests/classes/ForSQLTest.php',
                'grandparent' => '/ludoDB/Tests/classes/Dependencies/GrandParent.php',
                'gridwithpaging' => '/resources/GridWithPaging.php',
                'ixhprofruns' => '/ludoDB/xhprof/xhprof_lib/utils/xhprof_runs.php',
                'jsontest' => '/ludoDB/Tests/JSONTest.php',
                'leafnode' => '/ludoDB/Tests/classes/LeafNode.php',
                'leafnodes' => '/ludoDB/Tests/classes/LeafNodes.php',
                'ludodb' => '/ludoDB/LudoDB.php',
                'ludodbadapter' => '/ludoDB/LudoDBInterfaces.php',
                'ludodbadaptertest' => '/ludoDB/Tests/LudoDBAdapterTest.php',
                'ludodballtests' => '/ludoDB/Tests/LudoDBAllTests.php',
                'ludodbauthenticator' => '/ludoDB/LudoDBInterfaces.php',
                'ludodbcache' => '/ludoDB/LudoDBCache.php',
                'ludodbclassnotfoundexception' => '/ludoDB/LudoDBExceptions.php',
                'ludodbcollection' => '/ludoDB/LudoDBCollection.php',
                'ludodbcollectionconfigparser' => '/ludoDB/LudoDBCollectionConfigParser.php',
                'ludodbconfigparser' => '/ludoDB/LudoDBConfigParser.php',
                'ludodbconnectionexception' => '/ludoDB/LudoDBExceptions.php',
                'ludodbexception' => '/ludoDB/LudoDBExceptions.php',
                'ludodbinvalidargumentsexception' => '/ludoDB/LudoDBExceptions.php',
                'ludodbinvalidconfigexception' => '/ludoDB/LudoDBExceptions.php',
                'ludodbinvalidmodeldataexception' => '/ludoDB/LudoDBExceptions.php',
                'ludodbinvalidserviceexception' => '/ludoDB/LudoDBExceptions.php',
                'ludodbiterator' => '/ludoDB/LudoDBIterator.php',
                'ludodbmodel' => '/ludoDB/LudoDBModel.php',
                'ludodbmodeltests' => '/ludoDB/Tests/LudoDBModelTests.php',
                'ludodbmysql' => '/ludoDB/LudoDBMysql.php',
                'ludodbmysqli' => '/ludoDB/LudoDBMySqlI.php',
                'ludodbobject' => '/ludoDB/LudoDBObject.php',
                'ludodbobjectnotfoundexception' => '/ludoDB/LudoDBExceptions.php',
                'ludodbpdo' => '/ludoDB/LudoDBPDO.php',
                'ludodbpdooracle' => '/ludoDB/LudoDBPDOOracle.php',
                'ludodbprofiling' => '/ludoDB/LudoDBProfiling.php',
                'ludodbregistry' => '/ludoDB/LudoDBRegistry.php',
                'ludodbrequesthandler' => '/ludoDB/LudoDBRequestHandler.php',
                'ludodbrevision' => '/ludoDB/LudoDBRevision.php',
                'ludodbservice' => '/ludoDB/LudoDBInterfaces.php',
                'ludodbservicenotimplementedexception' => '/ludoDB/LudoDBExceptions.php',
                'ludodbserviceregistry' => '/ludoDB/LudoDBServiceRegistry.php',
                'ludodbsql' => '/ludoDB/LudoDBSQL.php',
                'ludodbtreecollection' => '/ludoDB/LudoDBTreeCollection.php',
                'ludodbtreecollectiontest' => '/ludoDB/Tests/LudoDBTreeCollectionTest.php',
                'ludodbunauthorizedexception' => '/ludoDB/LudoDBExceptions.php',
                'ludodbutility' => '/ludoDB/LudoDBUtility.php',
                'ludodbutilitymock' => '/ludoDB/Tests/LudoDBUtilityTest.php',
                'ludodbutilitytest' => '/ludoDB/Tests/LudoDBUtilityTest.php',
                'ludodbvalidationtest' => '/ludoDB/Tests/LudoDBValidationTest.php',
                'ludodbvalidator' => '/ludoDB/LudoDBValidator.php',
                'ludojs' => '/ludoDB/LudoJS.php',
                'ludojscountries' => '/resources/user-admin/LudoJSCountries.php',
                'ludojscountry' => '/resources/user-admin/LudoJSCountry.php',
                'ludojstests' => '/ludoDB/Tests/LudoJSTests.php',
                'ludojsuser' => '/resources/user-admin/LudoJSUser.php',
                'ludojsusers' => '/resources/user-admin/LudoJSUsers.php',
                'manager' => '/ludoDB/Tests/classes/Manager.php',
                'modelwithsqlmethod' => '/ludoDB/Tests/classes/ModelWithSqlMethod.php',
                'movie' => '/ludoDB/Tests/classes/Movie.php',
                'mysqlitests' => '/ludoDB/Tests/MysqlITests.php',
                'noludodbclass' => '/ludoDB/Tests/classes/Dependencies/NoLudoDBClass.php',
                'pdotests' => '/ludoDB/Tests/PDOTests.php',
                'people' => '/ludoDB/Tests/classes/People.php',
                'peopleplain' => '/ludoDB/Tests/classes/PeoplePlain.php',
                'performancetest' => '/ludoDB/Tests/PerformanceTest.php',
                'person' => '/ludoDB/Tests/classes/Person.php',
                'personforconfigparser' => '/ludoDB/Tests/classes/PersonForConfigParser.php',
                'personforutility' => '/ludoDB/Tests/classes/PersonForUtility.php',
                'personwithauthinterface' => '/ludoDB/Tests/classes/PersonWithAuthInterface.php',
                'personwithvalidation' => '/ludoDB/Tests/classes/Validation/PersonWithValidation.php',
                'phone' => '/ludoDB/Tests/classes/Phone.php',
                'phonecollection' => '/ludoDB/Tests/classes/PhoneCollection.php',
                'requesthandlermock' => '/ludoDB/Tests/classes/RequestHandlerMock.php',
                'requesthandlertest' => '/ludoDB/Tests/RequestHandlerTest.php',
                'section' => '/ludoDB/Tests/classes/Section.php',
                'sqltest' => '/ludoDB/Tests/SQLTest.php',
                'staticcountries' => '/resources/StaticCountries.php',
                'staticuser' => '/resources/StaticUser.php',
                'testbase' => '/ludoDB/Tests/TestBase.php',
                'testcountry' => '/ludoDB/Tests/classes/TestCountry.php',
                'testgame' => '/ludoDB/Tests/classes/TestGame.php',
                'testnode' => '/ludoDB/Tests/classes/TestNode.php',
                'testnodes' => '/ludoDB/Tests/classes/TestNodes.php',
                'testnodeswithleafs' => '/ludoDB/Tests/classes/TestNodesWithLeafs.php',
                'testtable' => '/ludoDB/Tests/classes/TestTable.php',
                'testtimer' => '/ludoDB/Tests/classes/TestTimer.php',
                'tludojscountries' => '/ludoDB/Tests/classes/LudoJS/LudoJSCountries.php',
                'tludojscountry' => '/ludoDB/Tests/classes/LudoJS/LudoJSCountry.php',
                'tludojsperson' => '/ludoDB/Tests/classes/LudoJS/LudoJSPerson.php',
                'xhpprofiling' => '/ludoDB/xhprof/XHPProfiling.php',
                'xhprofruns_default' => '/ludoDB/xhprof/xhprof_lib/utils/xhprof_runs.php'
            );
        }
        $cn = strtolower($class);
        if (isset($classes[$cn])) {
            require __DIR__ . $classes[$cn];
        }
    }
);
// @codeCoverageIgnoreEnd