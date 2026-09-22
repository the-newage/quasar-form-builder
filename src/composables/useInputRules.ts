import {computed, inject, toValue} from 'vue'
import { all as allVeeValidations } from '@vee-validate/rules'

export interface ValidationConfig {
    i18n?: (key: string, named?: Record<string, string>) => string;
    customRules?: Record<string, (value: any, params?: any[]) => boolean | string>;
}

export const FORM_VALIDATOR_KEY = Symbol('FormValidator')

export const createFormBuilderValidation = (config: ValidationConfig = {}) => {
    const allValidations: Record<string, any> = {
        ...allVeeValidations,
        ...(config.customRules || {})
    }

    const getTranslation = config.i18n || ((key: string) => key)

    function getRuleTranslation (ruleName: string, ruleParams: any[], fieldName: string) {
        debugger
        const translatedFieldName = !fieldName ? '-' : getTranslation(fieldName)
        const validationParamsForTranslation = getRuleParamsForTranslation(ruleName, ruleParams)
        const translationParams = { field: translatedFieldName, ...validationParamsForTranslation }
        return getTranslation('error.validation.' + ruleName, translationParams)
    }

    function getRuleParamsForTranslation (
        ruleName: string,
        ruleParams: any[]
    ): Record<string, string> {
        const val = Array.isArray(ruleParams) ? ruleParams[0] : ruleParams;
        if (
            ruleName === 'digits' ||
            ruleName === 'length' ||
            ruleName === 'min' ||
            ruleName === 'max'
        ) {
            return { length: String(val ?? '') }
        }

        if (ruleName === 'between') {
            return { min: String(ruleParams[0] ?? ''), max: String(ruleParams[1] ?? '') }
        }

        if (ruleName === 'dimensions') {
            return { width: String(ruleParams[0] ?? ''), height: String(ruleParams[1] ?? '') }
        }

        if (ruleName === 'max_value') {
            return { max: String(val ?? '') }
        }

        if (ruleName === 'min_value') {
            return { min: String(val ?? '') }
        }

        if (ruleName === 'size') {
            return { size: String(val ?? '') }
        }

        return {}
    }

    function parseRule (rule: string) {
        let params: string[] = []
        const [name, ...rest] = rule.split(':')

        if (rest.length > 0) {
            if (name === 'regex') {
                params = [rest.join(':')]
            } else {
                params = rest.join(':').split(',')
            }
        }

        return { name, params }
    }

    function buildParams (provided: unknown[] | Record<string, unknown>) {
        if (Array.isArray(provided)) {
            return provided
        }

        if (provided instanceof RegExp) {
            return [provided]
        }

        return Object.keys(provided).reduce(
            (prev, key) => {
                prev[key] = (provided as Record<string, unknown>)[key]
                return prev
            },
            {} as Record<string, unknown>
        )
    }

    function getNormalizeRules (
        rulesString: string
    ): Record<string, unknown[] | Record<string, unknown>> {
        const acc: Record<string, unknown[] | Record<string, unknown>> = {}

        const regexPattern = /regex:.*$/
        const regexMatch = rulesString.match(regexPattern)
        let regexRule = ''

        if (regexMatch) {
            regexRule = regexMatch[0]
            rulesString = rulesString.replace(regexPattern, '')
        }

        const rulesArrayOfString = rulesString.split('|').filter(Boolean)
        if (regexRule) {
            rulesArrayOfString.push(regexRule)
        }

        return rulesArrayOfString.reduce((prev, rule) => {
            const parsedRule = parseRule(rule)
            if (!parsedRule.name) {
                return prev
            }

            prev[parsedRule.name] = buildParams(parsedRule.params)

            return prev
        }, acc)
    }

    function parseRules (targetRules: string, fieldName: string = '') {
        const normalizeRules = getNormalizeRules(targetRules)
        return Object.keys(normalizeRules).reduce(
            (accumulator, ruleName) => {
                // این جا ruleParams رو از آرایه یا آبجکت می‌کشی بیرون
                const rawParams = normalizeRules[ruleName]
                const ruleParams = Array.isArray(rawParams) ? rawParams : [rawParams]

                const ruleFunction = function (inputValue: any) {
                    const fn = allValidations[ruleName]
                    if (typeof fn === 'function') {
                        // vee-validate معمولاً پارامترها رو به صورت آرایه یا باز شده می‌خواد
                        const ruleResult = fn(inputValue, ruleParams)
                        if (ruleResult === true) return true
                        if (typeof ruleResult === 'string') return ruleResult

                        return getRuleTranslation(ruleName, ruleParams, fieldName)
                    }
                    return false
                }
                ruleFunction.ruleName = ruleName
                ruleFunction.ruleParams = ruleParams
                // @ts-ignore
                accumulator.push(ruleFunction)
                return accumulator
            },
            [] as ((inputValue: string | number) => boolean | string)[]
        )
    }

    return {
        parseRules
    }
}

export function useInputRules(props: {
    rules?: any,
    label?: string | import('vue').Ref<string> | import('vue').ComputedRef<string> | (() => string)
}) {
    const validator = inject<ReturnType<typeof createFormBuilderValidation>>(FORM_VALIDATOR_KEY)

    const parsedRules = computed(() => {
        if (!validator) return toValue(props.rules) || []

        // تبدیل به مقدار خام برای استفاده در لاجیک
        const rawRules = toValue(props.rules)
        const rawLabel = toValue(props.label) || ''

        // اگر رول استرینگ بود پارس کن، اگر نبود همون رو برگردون
        if (typeof rawRules === 'string') {
            return validator.parseRules(rawRules, rawLabel)
        }
        return rawRules || []
    })

    return { parsedRules }
}
