# 贡献指南

目前本文档仅包含如何贡献新的专辑数据, 网站部分代码的文档待补充.

## 创建专辑文件夹
直接往 `public/data` 文件夹中新建文件夹, 文件夹名称遵循以下规则:
- 直接使用专辑的准确名称.
- 如果有系统禁止的字符 (如 `/`), 可以省略掉.
- 如果出现撞名称, 则增加社团名, 例如:
  - `专辑名 (社团名)`
  - `专辑名 (社团名A & 社团名B)`

## 添加元数据
专辑文件夹中需要包含两个文件:
- `metadata.json`: 专辑元数据, 内容格式和 [Touhou-Tagger 的 local-json 一致](https://github.com/the1812/Touhou-Tagger/#local-json), 可以使用省略语法.
- `metadata.json` 中可以添加额外的元数据 `extraData`, 仅用于 Doujin Meta 网站的展示, 不会写入到歌曲元数据中. (例子可参考 [东方之星](https://github.com/the1812/Doujin-Meta/blob/main/public/data/%E4%B8%9C%E6%96%B9%E4%B9%8B%E6%98%9F/metadata.json))
  - `links`: 可供获取专辑的渠道
    - `dizzylab`: dizzylab 专辑 ID, 会自动拼接为 `https://www.dizzylab.net/d/{{ 专辑 ID }}`
    - `thbWiki`: THBWiki 唯一标识符, 会自动拼接为 `https://thwiki.cc/{{ 标识符 }}`
- `cover.jpg` 或 `cover.png`: 专辑封面图, 分辨率尽量高一些, 但大小最好不要超过 2MB, 如果超了可以用 [Squoosh](https://squoosh.app) 压缩一下.
