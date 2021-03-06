interface StringToken {
  type: 'string'
  start: number
  end: number
  value: string
}
interface PartToken {
  type: 'part'
  start: number
  end: number
  value: string
}
export type Token = StringToken | PartToken
export function* parse(text: string): Iterable<Token> {
  let value = ''
  let tokenStart = 0
  let open = false
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '{' && text[i + 1] === '{' && text[i - 1] !== '\\' && !open) {
      open = true
      if (value) yield {type: 'string', start: tokenStart, end: i, value}
      value = '{{'
      tokenStart = i
      i += 2
    } else if (text[i] === '}' && text[i + 1] === '}' && text[i - 1] !== '\\' && open) {
      open = false
      yield {type: 'part', start: tokenStart, end: i + 2, value: value.slice(2).trim()}
      value = ''
      i += 2
      tokenStart = i
    }
    value += text[i] || ''
  }
  if (value) yield {type: 'string', start: tokenStart, end: text.length, value}
}
