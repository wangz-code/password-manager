package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func get(url string) string {
	// func http.NewRequest(method string, url string, body io.Reader) (*http.Request, error)
	req, _ := http.NewRequest(http.MethodGet, url, nil)
	cli := http.Client{
		// Transport RoundTripper
		// CheckRedirect func(req *Request, via []*Request) error
		// Jar CookieJar
		Timeout: time.Second * 120, // 请求超时timeout.
	}
	resp, err := cli.Do(req)
	// 请求异常
	if err != nil {
		fmt.Println(err)
		return ""
	}

	body, _ := ioutil.ReadAll(resp.Body)
	msg := string(body)
	// 延迟释放请求
	defer resp.Body.Close()
	return msg

}

// 生成CSV文件
func (a *App) ExportCsv(value [][]string) bool {
	f, err := os.Create("/Users/wz/Documents/导出密码.csv") //创建文件
	if err != nil {
		panic(err)
	}
	defer f.Close()

	f.WriteString("\xEF\xBB\xBF") // 写入UTF-8 BOM
	w := csv.NewWriter(f)         //创建一个新的写入文件流
	w.WriteAll(value)             //写入数据
	w.Flush()
	return true

}
