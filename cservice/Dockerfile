FROM golang:1.22.1 as development

WORKDIR /app

RUN go install github.com/githubnemo/CompileDaemon@latest

COPY go.mod ./
COPY go.sum ./
RUN go mod tidy

COPY . .

LABEL org.opencontainers.image.source https://github.com/iokiris/shafo

CMD ["CompileDaemon", "-polling=true", "-log-prefix=true", "-build=go build -o ./tmp/myapp ./cmd/cservice", "-command=./tmp/myapp"]

#FROM golang:1.22.1 as builder
#
#WORKDIR /app
#
#COPY go.mod ./
##COPY go.sum ./
#
#RUN go mod tidy
#
#COPY . .
#
#RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o cservice ./cmd/cservice
#
#FROM scratch
#
#COPY --from=builder /app/cservice /cservice
#
#CMD ["/cservice"]
