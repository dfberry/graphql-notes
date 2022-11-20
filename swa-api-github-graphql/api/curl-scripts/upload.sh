    curl -X POST \
    -F 'filename=@host.json' \
    -H 'Content-Type: application/json' \
    'http://localhost:7071/api/upload?filename=host4.json&containername=daily&directoryname=aggregate-github&code=123' --verbose
