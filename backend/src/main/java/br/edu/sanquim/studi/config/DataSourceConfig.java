package br.edu.sanquim.studi.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.InetSocketAddress;
import java.net.Socket;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/studi_db}")
    private String pgUrl;

    @Value("${spring.datasource.username:studi_user}")
    private String pgUser;

    @Value("${spring.datasource.password:studi_password}")
    private String pgPassword;

    @Value("${db.host:localhost}")
    private String dbHost;

    @Value("${db.port:5432}")
    private int dbPort;

    @Bean
    @Primary
    public DataSource dataSource() {
        if (isDatabaseReachable(dbHost, dbPort)) {
            log.info(">>> Conectando ao PostgreSQL em {}:{} com sucesso!", dbHost, dbPort);
            HikariDataSource ds = new HikariDataSource();
            ds.setDriverClassName("org.postgresql.Driver");
            ds.setJdbcUrl(pgUrl);
            ds.setUsername(pgUser);
            ds.setPassword(pgPassword);
            return ds;
        } else {
            log.warn(">>> PostgreSQL não disponível em {}:{}. Ativando banco em memória H2 (compatibilidade PostgreSQL) para execução imediata!", dbHost, dbPort);
            HikariDataSource ds = new HikariDataSource();
            ds.setDriverClassName("org.h2.Driver");
            ds.setJdbcUrl("jdbc:h2:mem:studi_db;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH;DB_CLOSE_DELAY=-1");
            ds.setUsername("sa");
            ds.setPassword("");
            return ds;
        }
    }

    private boolean isDatabaseReachable(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), 1000);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
