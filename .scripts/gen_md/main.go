package main

import (
	"context"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gfile"
	"github.com/gogf/gf/v2/text/gregex"
	"github.com/gogf/gf/v2/text/gstr"
)

const (
	srcMdDirPath = `/Users/john/Downloads/cf`
	dstMdDirPath = `/Users/john/Workspace/github/gqcn/gqcn/docs`
)

func main() {
	ctx := context.Background()
	mdTitleToPathMap := getSrcMdTitleToPathMap()
	g.DumpJson(mdTitleToPathMap)
	files, err := gfile.ScanDirFile(dstMdDirPath, "*.md", true)
	if err != nil {
		panic(err)
	}
	for _, file := range files {
		fileContent := gstr.Trim(gfile.GetContents(file))
		match1, _ := gregex.MatchString(`---([\s\S]+)---`, fileContent)
		if len(match1) < 2 {
			g.Log().Warning(ctx, file)
			continue
		}
		match2, _ := gregex.MatchString(`title: "(.+?)"`, match1[1])
		frontMatter := match1[0]
		title := match2[1]
		srcFilePath := mdTitleToPathMap[title]
		if srcFilePath == "" {
			g.Log().Warningf(ctx, "no src found for: %s", file)
			continue
		}
		srcFileContent := gfile.GetContents(srcFilePath)
		mdContent := gstr.Trim(gstr.SubStrFromEx(srcFileContent, "\n"))
		if gstr.Contains(mdContent, "> [!NOTE]") {
			mdContent = gstr.StrTillEx(mdContent, "> [!NOTE]")
		}
		newContent := frontMatter + "\n\n" + mdContent
		_ = gfile.PutContents(file, newContent)
	}
}

func getSrcMdTitleToPathMap() map[string]string {
	m := make(map[string]string)
	files, err := gfile.ScanDirFile(srcMdDirPath, "*.md", true)
	if err != nil {
		panic(err)
	}
	for _, file := range files {
		fileContent := gstr.Trim(gfile.GetContents(file))
		title := gstr.StrTill(fileContent, "\n")
		title = gstr.Trim(title, "# ")
		m[title] = file
	}
	return m
}
