/*eslint-disable */
/*eslint-disable-next-line */
/*react-internal/no-production-logging*/

// @ts-nocheck
import React, {Component} from 'react';

import {PdfLoader, PdfHighlighter, Popup, AreaHighlight, Tip, PdfHighlighter2} from './PDFCore';

import type {IHighlight, NewHighlight} from './PDFCore';

import {testHighlights as _testHighlights} from './test-highlights';
import {Spinner} from './Spinner';
import {Sidebar} from './Sidebar';
import {Highlight} from './components/Highlight/Highlight';
import AddTip from './components/AddTip/AddTip';
import './style/App.css';

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

interface State {
  url: string;
  highlights: Array<IHighlight>;
}

const getNextId = () => String(Math.random()).slice(2);

// 通过 #铆点 定位id
const parseIdFromHash = () => document.location.hash.slice('#highlight-'.length);

const resetHash = () => {
  document.location.hash = '';
};

const HighlightPopup = ({comment}: {comment: {text: string; emoji: string}}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const PRIMARY_PDF_URL = './pdf/1708.08021.pdf';
const SECONDARY_PDF_URL = './pdf/1604.02480.pdf';

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get('url') || PRIMARY_PDF_URL;

class App extends Component<{}, State> {
  state = {
    url: initialUrl, // url
    highlights: testHighlights[initialUrl] // 数据
      ? [...testHighlights[initialUrl]]
      : [],
  };

  // 重新全部撤销绘制
  resetHighlights = () => {
    this.setState({
      highlights: [],
    });
  };

  // 切换文档
  toggleDocument = () => {
    const newUrl = this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    this.setState({
      url: newUrl,
      highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : [],
    });
  };

  // 滚动到
  scrollViewerTo = (highlight: any) => {};

  // 滚动
  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    window.addEventListener('hashchange', this.scrollToHighlightFromHash, false);
  }

  // 依据id 获取高亮节点
  getHighlightById(id: string) {
    const {highlights} = this.state;

    return highlights.find((highlight) => highlight.id === id);
  }

  // 添加高亮点
  addHighlight(highlight: NewHighlight) {
    const {highlights} = this.state;

    this.setState({
      highlights: [{...highlight, id: getNextId()}, ...highlights],
    });
  }

  updateHighlight(highlightId: string, position: Object, content: Object) {
    this.setState({
      highlights: this.state.highlights.map((h) => {
        const {id, position: originalPosition, content: originalContent, ...rest} = h;
        return id === highlightId
          ? {
              id,
              position: {...originalPosition, ...position},
              content: {...originalContent, ...content},
              ...rest,
            }
          : h;
      }),
    });
  }

  render() {
    const {url, highlights} = this.state;

    return (
      <div className="App">
        <div className="pdf-content">
          <PdfLoader url={url} beforeLoad={<Spinner />}>
            {(pdfDocument) => (
              <PdfHighlighter2
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey} // 区域选择器
                onScrollChange={resetHash}
                // pdfScaleValue="page-width" // 充满屏幕
                scrollRef={(scrollTo) => {
                  // 用于定位和滚动屏幕
                  this.scrollViewerTo = scrollTo;

                  this.scrollToHighlightFromHash();
                }}
                onSelectionFinished={(
                  // 当选择结束之后  add 的时候
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection,
                ) => (
                  // 重构 能够满足我们吗？
                  <Tip
                    content={content}
                    onOpen={transformSelection}
                    onConfirm={(comment) => {
                      this.addHighlight({content, position, comment});
                      hideTipAndSelection();
                    }}
                  />
                )}
                highlightTransform={(
                  // 转换 高亮条
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo,
                ) => {
                  const isTextHighlight = !Boolean(highlight.content && highlight.content.image);

                  // 看看是文字还是区域
                  const component = isTextHighlight ? (
                    // 重构完全可以自实现
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                      style={{
                        color: 'red',
                      }}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        this.updateHighlight(
                          highlight.id,
                          {boundingRect: viewportToScaled(boundingRect)},
                          {image: screenshot(boundingRect)},
                        );
                      }}
                    />
                  );

                  // 放上去的时候 hover一下
                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
        <Sidebar highlights={highlights} resetHighlights={this.resetHighlights} toggleDocument={this.toggleDocument} />
      </div>
    );
  }
}

export default App;
