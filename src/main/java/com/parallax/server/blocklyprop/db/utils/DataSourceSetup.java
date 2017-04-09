/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.parallax.server.blocklyprop.db.utils;

import java.util.ArrayList;
import java.util.List;
import javax.sql.DataSource;
import org.apache.commons.configuration.Configuration;
import org.apache.commons.dbcp2.ConnectionFactory;
import org.apache.commons.dbcp2.DriverManagerConnectionFactory;
import org.apache.commons.dbcp2.PoolableConnection;
import org.apache.commons.dbcp2.PoolableConnectionFactory;
import org.apache.commons.dbcp2.PoolingDataSource;
import org.apache.commons.pool2.ObjectPool;
import org.apache.commons.pool2.impl.GenericObjectPool;

/**
 *
 * @author Michel
 */
public class DataSourceSetup {

    // SQL database source
    private static DataSource dataSource;

    // 
    private static List<NeedsDataSource> dataSourceUsers = new ArrayList<NeedsDataSource>();

    /**
     * Get the static data source instance
     * 
     * @return A static DataSource object. The object may be null.
     */
    public static DataSource getDataSource() {
        return dataSource;
    }

    /**
     * 
     * @param dataSourceUser 
     */
    public static void registerDataSourceUsers(NeedsDataSource dataSourceUser) {
        if (dataSource != null) {
            dataSourceUser.setDataSource(dataSource);
        } else {
            dataSourceUsers.add(dataSourceUser);
        }
    }

    public static PoolingDataSource connect(Configuration configuration)
            throws ClassNotFoundException {
        
        String driver = configuration.getString("database.driver");
        String url = configuration.getString("database.url");
        String username = configuration.getString("database.username");
        String password = configuration.getString("database.password");

        //
        // Returns the Class object associated with the class or interface 
        // with the given string name. Invoking this method is equivalent to:
        // Class.forName(className, true, currentLoader)
        // where currentLoader denotes the defining class loader of the 
        // current class.
        //
        Class.forName(driver);

        //
        // First, we'll create a ConnectionFactory that the
        // pool will use to create Connections.
        // We'll use the DriverManagerConnectionFactory,
        // using the connect string passed in the command line
        // arguments.
        //
        ConnectionFactory connectionFactory = new DriverManagerConnectionFactory(url, username, password);

        //
        // Next we'll create the PoolableConnectionFactory, which wraps
        // the "real" Connections created by the ConnectionFactory with
        // the classes that implement the pooling functionality.
        //
        PoolableConnectionFactory poolableConnectionFactory = new PoolableConnectionFactory(connectionFactory, null);
        poolableConnectionFactory.setValidationQuery("SELECT 1");
        poolableConnectionFactory.setMaxConnLifetimeMillis(5000);

        //
        // Now we'll need a ObjectPool that serves as the
        // actual pool of connections.
        //
        // We'll use a GenericObjectPool instance, although
        // any ObjectPool implementation will suffice.
        //
        ObjectPool<PoolableConnection> connectionPool = new GenericObjectPool<>(poolableConnectionFactory);

        // Set the factory's pool property to the owning pool
        poolableConnectionFactory.setPool(connectionPool);

        //
        // Finally, we create the PoolingDriver itself,
        // passing in the object pool we created.
        //
        PoolingDataSource<PoolableConnection> dataSourceInstance
                = new PoolingDataSource<>(connectionPool);

        for (NeedsDataSource dataSourceUser : dataSourceUsers) {
            dataSourceUser.setDataSource(dataSourceInstance);
        }
        
        DataSourceSetup.dataSource = dataSourceInstance;
        
        return dataSourceInstance;
    }

}
