package br.edu.sanquim.studi.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "BearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Colégio Sanquim — Studi+ API REST")
                        .description("API RESTful escalável, segura e orientada a contratos para o sistema escolar do Colégio Sanquim (Cursinho Gratuito) - FATEC Arthur de Azevedo.\n\n"
                                + "### Autenticação JWT\n"
                                + "Utilize o endpoint `/api/auth/login` para autenticar e obter o Bearer Token. "
                                + "Em seguida, clique no botão **Authorize** abaixo e insira o token no formato: `Bearer <SEU_TOKEN>`.\n\n"
                                + "### Perfis de Acesso (RBAC)\n"
                                + "- **ROLE_GESTAO**: Administradores e secretaria escolar (acesso total aos módulos administrativos).\n"
                                + "- **ROLE_PROFESSOR**: Corpo docente (gestão de chamadas, avaliações, notas e planos de aula).\n"
                                + "- **ROLE_ALUNO**: Discentes (consulta ao boletim, frequência e linha do tempo de aulas).")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipe Studi+ / Sanquim — ADS FATEC")
                                .email("contato@sanquim.edu.br"))
                        .license(new License().name("Apache 2.0").url("https://www.apache.org/licenses/LICENSE-2.0")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Informe o token JWT obtido no login (exemplo: Bearer eyJhbGci...)")));
    }
}
