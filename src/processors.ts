import type {TemplatePart} from './types.js'
import type {TemplateInstance} from './template-instance.js'
import {AttributeTemplatePart} from './attribute-template-part.js'

export const propertyIdentity = {
  createCallback(instance: TemplateInstance, parts: Iterable<TemplatePart>, params: unknown): void {
    this.processCallback(instance, parts, params)
  },
  processCallback(instance: TemplateInstance, parts: Iterable<TemplatePart>, params: unknown): void {
    if (!params || typeof params !== 'object') return
    for (const part of parts) {
      part.value = String((params as Record<string, unknown>)[part.expression] ?? '')
    }
  }
}

export const propertyIdentityOrBooleanAttribute = {
  createCallback(instance: TemplateInstance, parts: Iterable<TemplatePart>, params: unknown): void {
    this.processCallback(instance, parts, params)
  },
  processCallback(instance: TemplateInstance, parts: Iterable<TemplatePart>, params: unknown): void {
    if (!params || typeof params !== 'object') return
    for (const part of parts) {
      const value = (params as Record<string, unknown>)[part.expression] ?? ''
      if (
        typeof value === 'boolean' &&
        part instanceof AttributeTemplatePart &&
        typeof part.element[part.attributeName as keyof Element] === 'boolean'
      ) {
        part.booleanValue = value
      } else {
        part.value = String(value)
      }
    }
  }
}
