# Separador de PDF

Divide um arquivo _.pdf_ e extraí informações internas para renomear os arquivo.

## Requisitos importantes

Node version  11.0.0

Python version 2.7

**Executar como administrador**

npm install --global --production windows-build-tools

npm config set msvs_version 2017 -global

**Se tiver mais de uma versão do Python instalada**

npm config set python python2.7

## Configurar .env

O arquivo .env é responsável pelas configurações utilizadas para extrair e renomear os arquivos.

### Variáveis

-   _LAYOUT_: identifica os layouts disponíveis que serão apresentados na tela. Os layouts devem ser separados por `','`.

-   *FIELD_NAME_<'LAYOUT'>*: para cada **LAYOUT** deve criar um **FIELD_NAME** que representa o texto que antecede a informação a ser extraída para renomear os arquivos.

-   *QTDE_CHAR_<'LAYOUT'>*: quantidade de caracteres após o **FIELD_NAME** usado para renomear os arquivos.

**OBS**: *QTDE_CHAR_<'LAYOUT'>* sem valor `""`, utiliza o nome do **LAYOUT** para renomar os arquivos.

### Variáveis de paginação

Alguns documentos necessitam que sejam separados x páginas por arquivo.

-   *PAGE_NAME_<'LAYOUT'>*: texto que identifica a página do documento.
-   *MAX_PAGE_<'LAYOUT'>*: quantidade máxima de páginas que um arquivo pode ter.

**Exemplo arquivo .env**

```sh
# Funcionario
FIELD_NAME_FUNCIONARIO="Código:"
QTDE_CHAR_FUNCIONARIO=5

# Telefone
FIELD_NAME_TELEFONE="Tel:"
QTDE_CHAR_TELEFONE=9

# Outros (separador por página comum)
FIELD_NAME_OUTRO=""

# Dirf
FIELD_NAME_DIRF="Nome Completo"
QTDE_CHAR_DIRF=14
PAGE_NAME_DIRF="Pág."
MAX_PAGE_DIRF=2

# Layouts
LAYOUTS="Funcionario,Telefone,Outro,Dirf"
```

Com essas configurações quatro layouts estarão disponível para selecionar: _FUNCIONARIO_, _TELEFONE_, _OUTRO_ e _DIRF_.

-   **FUNCIONARIO**: os arquivos serão renomeados com os próximos _5_ caracteres após a palavra _Código:_ encontrada no arquivo.
-   **TELEFONE**: os arquivos serão renomeados com os próximos _9_ caracteres após a palavra _Tel:_ encontrada no arquivo.
-   **OUTRO**: os arquivos serão renomeados com o nome do LAYOUT (_Outro_) + o número da página. **Ex**: _Outro_1.pdf_
-   **DIRF**: os arquivos serão renomeados com os próximos _14_ caracteres após a palavra _Nome Completo_ encontrada no arquivo. Cada arquivo terá no máximo _2_ páginas
(conforme configurado em _MAX_PAGE_DIRF_).

## Ferramenta de Desenvolvedor

**CTRL + p** para abrir o _DevTools_

## Logs

Disponível na pasta **logs** da aplicação.

**_debug.log_** número da página e o texto extraído.

**_pdf.log_** primeira página do _.pdf_ (utilizado para identificar a localização das informações).

## Build

```sh
npm run build
```

## Corrigir erro de versão do NodeJS

excluir **package-lock.json** e a pasta **node_modules**

executar:

```sh
npm i
```

depois das dependências instaladas executar o rebuild:

```sh
npm run rebuild
```

e então gere o build:

```sh
npm run build
```

Copyright ® 2019 Victor Gianvechio
