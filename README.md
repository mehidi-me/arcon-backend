# Achron Backend

<!-- # Warning ⚠️

- run `mongod` command always with `--auth` option. we are not using config file. -->

## Hosting

- Aws Ec2 with nodejs pm2 package
- mongodb Atlas

## run with pm2

- `pm2 start yarn -- start:prod`

## some help when hosting/using mongodb in Linux

- `sudo chown -R $USER /data/db`. change folder location whenever the mongod logs tells read-only or permission denied.

### Multiple files json payload

```json
[
  {
    "fieldname": "images",
    "originalname": "300x300.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "./files",
    "filename": "300x300-42e7.jpg",
    "path": "files/300x300-42e7.jpg",
    "size": 98151
  },
  {
    "fieldname": "images",
    "originalname": "pexels-izaac-elms-8722616.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "./files",
    "filename": "pexels-izaac-elms-8722616-efa6.jpg",
    "path": "files/pexels-izaac-elms-8722616-efa6.jpg",
    "size": 132650
  }
]
```
# arcon-backend
