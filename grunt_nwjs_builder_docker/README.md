# Docker Grunt NWJS

## How to create the container
```
docker build -t leknoppix/nwjs .
```

## How to run
```
docker run -ti --rm -v $(pwd):/var/nodejs leknoppix/nwjs bash
```

## And now?
Now, you can use:
`
npm install
`
to get npm module and use
`
grunt
`
to compile your project.