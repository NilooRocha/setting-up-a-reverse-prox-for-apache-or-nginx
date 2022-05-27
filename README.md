# Configurazione di un **Reverse Proxy** (Apache e Nginx)

## Che cos'è un reverse proxy?

Il [Reverse proxy](https://httpd.Apache.org/docs/2.4/howto/reverse_proxy.html)  si posiziona davanti a un server Web e riceve tutte le richieste prima che raggiungano il server di origine. Funziona in modo simile a un forward proxy, ma in questo caso è il server Web a utilizzare il proxy e non l'utente o il client. I reverse proxy sono generalmente utilizzati per migliorare le prestazioni, la sicurezza e l'affidabilità dei server Web.

![reverse proxy image](https://www.asustor.com/images/admv2/reverse_proxy/revise_proxy_1)

## Configurazione con **Apache**

In questo esempio utilizzerò [Apache 2.4](https://httpd.Apache.org/download.cgi#Apache24) configurato su [Ubuntu 20.04](https://ubuntu.com/download).

Installare Apache su ubuntu

```sh
sudo apt-get update
```

```sh
sudo apt-get install Apache2
```

 Con Apache installato, per poter iniziare a configurare un reverse proxy dobbiamo abilitare alcuni moduli di Apache, di cui:

- [mod_proxy](https://httpd.Apache.org/docs/2.4/mod/mod_proxy.html)

```sh
sudo a2enmod proxy
```

- [mod_proxy_http](https://httpd.Apache.org/docs/2.4/mod/mod_proxy_http.html)

```sh
sudo a2enmod proxy_http
```

> `a2enmod` → Attiva un modulo in Apache

Dopo aver abilitato i moduli, dobbiamo creare un virtualhost

```sh
sudo vi /etc/Apache2/sites-available/apache-reverse-proxy.conf
```

> [Virtual host](https://httpd.Apache.org/docs/2.4/mod/core.html#virtualhost) è una direttiva di configurazione di Apache che consente di eseguire più di un sito web su un singolo server.

Ora configuriamo il reverse proxy, inseriamo dentro queste configurazione:

``` Apacheconf
<virtualHost *:*>

        ProxyPass /backend1 http://localhost:3002/
        ProxyPassReverse /backend1 http://localhost:3002/

        ProxyPass /backend2 http://localhost:3001/
        ProxyPassReverse /backend2 http://localhost:3001/

</VirtualHost>
```

| Direttiva | Funzionalità |
| ------ | ------ |
| [ProxyPass](https://httpd.Apache.org/docs/2.4/mod/mod_proxy.html#proxypass) |crea il reverse proxy  |
| [ProxyPassReverse](https://httpd.Apache.org/docs/2.4/mod/mod_proxy.html#proxypassreverse) | modifica le headers inviate ad Apache da un server app proxy, prima che Apache le invii al browser.|
|[ServerName](https://httpd.Apache.org/docs/2.4/mod/core.html#servername)| imposta il nome host e la porta che il server utilizza per identificarsi.

> Un [Header](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_header) H  TTP è un campo di una richiesta o di una risposta HTTP che trasmette un contesto aggiuntivo e metadati sulla richiesta o sulla risposta. Ad esempio, un messaggio di richiesta può usare le intestazioni per indicare i formati multimediali preferiti, mentre una risposta può usare le intestazioni per indicare il formato multimediale del body restituito.

Ora attiviamo il VirtualHost e riavviamo Apache per ricaricare la configurazione dei moduli.

```sh
sudo a2ensite Apache2Proxy.conf
```

```sh
sudo systemctl restart Apache2
```

> `a2ensite` → è uno script che abilita il sito specificato (che contiene un blocco < VirtualHost > ) nella configurazione di Apache. Lo script non fa altro che lo [unlink](https://man7.org/linux/man-pages/man2/unlink.2.html#:~:text=DESCRIPTION%20top,is%20made%20available%20for%20reuse.) del file.conf all'interno di sites-enabled e crea un nuovo link con il .conf specificato.

Per verificare se tutte le impostazioni funzionano, basta aprire il browser o un request app (poostman, insomnia, ecc...) e fare una richiesta all'url specificato nella configurazione ([http://localhost/backend1](http://localhost/backend1) o [http://localhost/backend2](http://localhost/backend2) ), se tutto funziona si otterrà un *Success Response Code (200-299)*

>Devi accertati che i servizi di backend siano attivi, se non sono ancora stati configurati, seguire le istruzioni per [l'installazione e la configurazione](/server/README.md).

---

## Configurazione con **NGINX**

In questo esempio utilizzerò [Nginx](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/) configurato su [Ubuntu 20.04](https://ubuntu.com/download).

Installare Nginx su ubuntu

```sh
sudo apt-get update
```

```sh
sudo apt-get install nginx
```

La configurazione di nginx è molto simile a quella di apache, con alcune differenze.
In Nginx, a differenza di apache, non è necessario abilitare alcun modulo, quindi andiamo direttamente alla configurazione del .conf del reverse proxy.

```sh
sudo vi etc/nginx/sites-available/nginx-reverse-proxy.conf
```

e inseriamo dentro queste configurazione:

```nginx
server {

    location /backend1 {

        proxy_pass http://localhost:3001/;

    }

     location /backend2 {

        proxy_pass http://localhost:3002/;

    }

}
```

| Direttiva | Funzionalità |
| ------ | ------ |
| [server](https://nginx.org/en/docs/http/ngx_http_core_module.html#server) |crea il server. |
|[location](https://nginx.org/en/docs/http/ngx_http_core_module.html#location)| Imposta la configurazione in base a un URL di richiesta.
| [proxy_pass](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass) |crea il reverse proxy.  |

>In Apache possiamo usare la direttiva dp proxyPassReverse, ma in NGINX [non abbiamo](https://www.nginx.com/resources/wiki/start/topics/examples/likeapache/) questa direttiva. La soluzione è [aggiungere alcune headers HTTP mancanti](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header)

Per poter applicare le impostazioni corrette, dovremo prima disabilitare l'host virtuale predefinito sulla installazione di nginx, cancellando il link presente all'interno di `/etc/nginx/sites-enabled` e abilitare il nuovo host che abbiamo appena creato dentro di `/etc/nginx/sites-enabled`, e dopo, riavviare il servizio nginx per applicare tutte le modifiche.

```sh
sudo unlink /etc/nginx/sites-enabled/default
```

```sh
sudo ln -s /etc/nginx/sites-available/nginx-reverse-proxy.conf /etc/nginx/sites-enabled/nginx-reverse-proxy.conf
```

```sh
sudo systemctl restart nginx
```

>lanciando il [secondo comando](https://explainshell.com/explain?cmd=sudo+ln+-s+%2Fetc%2Fnginx%2Fsites-available%2Freverse-proxy.conf+%2Fetc%2Fnginx%2Fsites-enabled%2Freverse-proxy.conf) utilizziamo il parametro *-s* che è un parametro del comando `[ln](https://man7.org/linux/man-pages/man1/ln.1.html) che crea un  **symbolic link** e non un **hard link**. I hard link condividono il numero di [inode](https://it.siteground.com/kb/cose-un-inode/), mentre i  symbolic link non lo condividono. Con i  symbolic link, se il file o la directory originale viene cancellato, l'informazione viene persa, mentre con gli hard link non è così. I hard link sono copie esatte del file, mentre i  symbolic link sono semplici puntatori o "shortcuts". E nel nostro esempio non abbiamo bisogno di una copia del .conf ma di una "shortcut".

Per fine, fai la prova aprendo il browser o un request app (poostman, insomnia, ecc...) e fare una richiesta all'url specificato nella configurazione ([http://localhost/backend1](http://localhost/backend1) o [http://localhost/backend2](http://localhost/backend2) ), se tutto funziona si otterrà un *Success Response Code (200-299)*

>Anche qui, devi accertati che i servizi di backend siano attivi, se non sono ancora stati configurati, seguire le istruzioni per [l'installazione e la configurazione](/server/README.md).
