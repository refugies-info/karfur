# Client environments

## Build and run the client locally

Set the proper environment variables in a `client/.env` file (See [Sample](../../client/example-env-file.env)).

Build and start the client with docker:
```
# docker build -t refclient --build-arg APP_SERVER_URL=<backend_url> client/
# docker run --rm -p 127.0.0.1:3000:3000 -it refclient
```

The client is now accessible at `http://localhost:3000/`.

## Run the GCP build manually

```
$ gcloud builds submit --substitutions=_ENV="dev,SHORT_SHA=test" --config client/cloudbuild.yaml
```
