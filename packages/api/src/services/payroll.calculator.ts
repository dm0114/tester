/**
 * PayrollCalculator - 급여 계산 서비스
 *
 * 한국 4대보험 + 소득세 기준
 * freight-calc의 CargoCalculator 패턴 적용
 */

import type { PayrollCalculationInput, PayrollCalculationResult } from '@portfolio/types'

/** 보험료율 상수 (2024년 기준) */
const INSURANCE_RATES = {
  /** 국민연금: 4.5% (사업주 4.5%, 근로자 4.5% = 총 9%) */
  NATIONAL_PENSION: 0.045,
  /** 건강보험: 3.545% (2024년 기준) */
  HEALTH_INSURANCE: 0.03545,
  /** 장기요양보험: 건강보험료의 12.81% */
  LONG_TERM_CARE_RATE: 0.1281,
  /** 고용보험: 0.9% */
  EMPLOYMENT_INSURANCE: 0.009,
} as const

/** 연장근무 배율 */
const OVERTIME_MULTIPLIER = 1.5

/** 월 근무시간 (209시간 기준) */
const MONTHLY_WORK_HOURS = 209

export class PayrollCalculator {
  /**
   * 급여 계산 메인 함수
   */
  static calculate(input: PayrollCalculationInput): PayrollCalculationResult {
    const { base_salary, overtime_hours = 0, bonus = 0, additional_deductions = 0 } = input

    // 1. 연장근무수당 계산
    const overtimePay = this.calculateOvertimePay(base_salary, overtime_hours)

    // 2. 총 급여 (세전)
    const grossSalary = base_salary + overtimePay + bonus

    // 3. 4대보험 계산
    const insurance = this.calculateInsurance(grossSalary)

    // 4. 소득세 계산
    const tax = this.calculateIncomeTax(grossSalary)

    // 5. 총 공제액
    const totalDeductions =
      insurance.national_pension +
      insurance.health_insurance +
      insurance.long_term_care +
      insurance.employment_insurance +
      tax +
      tax * 0.1 + // 지방소득세
      additional_deductions

    // 6. 실수령액
    const netSalary = grossSalary - totalDeductions

    return {
      gross_salary: this.round(grossSalary),
      tax: this.round(tax),
      insurance: {
        national_pension: this.round(insurance.national_pension),
        health_insurance: this.round(insurance.health_insurance),
        long_term_care: this.round(insurance.long_term_care),
        employment_insurance: this.round(insurance.employment_insurance),
      },
      total_deductions: this.round(totalDeductions),
      net_salary: this.round(netSalary),
    }
  }

  /**
   * 시급 계산
   */
  static getHourlyRate(baseSalary: number): number {
    return baseSalary / MONTHLY_WORK_HOURS
  }

  /**
   * 연장근무수당 계산
   */
  static calculateOvertimePay(baseSalary: number, hours: number): number {
    const hourlyRate = this.getHourlyRate(baseSalary)
    return hourlyRate * OVERTIME_MULTIPLIER * hours
  }

  /**
   * 연장근무 시급 조회 (외부에서 사용)
   */
  static getOvertimeRate(baseSalary: number): number {
    return this.getHourlyRate(baseSalary) * OVERTIME_MULTIPLIER
  }

  /**
   * 4대보험 계산
   */
  static calculateInsurance(grossSalary: number): {
    national_pension: number
    health_insurance: number
    long_term_care: number
    employment_insurance: number
  } {
    const nationalPension = grossSalary * INSURANCE_RATES.NATIONAL_PENSION
    const healthInsurance = grossSalary * INSURANCE_RATES.HEALTH_INSURANCE
    const longTermCare = healthInsurance * INSURANCE_RATES.LONG_TERM_CARE_RATE
    const employmentInsurance = grossSalary * INSURANCE_RATES.EMPLOYMENT_INSURANCE

    return {
      national_pension: nationalPension,
      health_insurance: healthInsurance,
      long_term_care: longTermCare,
      employment_insurance: employmentInsurance,
    }
  }

  /**
   * 소득세 계산 (간이세액표 기반 단순화)
   *
   * TODO: 실제 간이세액표 적용 필요
   * 현재는 과세표준 구간별 세율로 단순 계산
   */
  static calculateIncomeTax(grossSalary: number): number {
    // 연봉 환산
    const annualSalary = grossSalary * 12

    // 과세표준 구간별 세율 (2024년 기준)
    // 실제로는 각종 공제 후 과세표준 기준
    let tax = 0

    if (annualSalary <= 14_000_000) {
      tax = annualSalary * 0.06
    } else if (annualSalary <= 50_000_000) {
      tax = 840_000 + (annualSalary - 14_000_000) * 0.15
    } else if (annualSalary <= 88_000_000) {
      tax = 6_240_000 + (annualSalary - 50_000_000) * 0.24
    } else if (annualSalary <= 150_000_000) {
      tax = 15_360_000 + (annualSalary - 88_000_000) * 0.35
    } else if (annualSalary <= 300_000_000) {
      tax = 37_060_000 + (annualSalary - 150_000_000) * 0.38
    } else if (annualSalary <= 500_000_000) {
      tax = 94_060_000 + (annualSalary - 300_000_000) * 0.4
    } else if (annualSalary <= 1_000_000_000) {
      tax = 174_060_000 + (annualSalary - 500_000_000) * 0.42
    } else {
      tax = 384_060_000 + (annualSalary - 1_000_000_000) * 0.45
    }

    // 월 소득세로 환산
    return tax / 12
  }

  /**
   * 원 단위 반올림 (10원 단위)
   */
  private static round(amount: number): number {
    return Math.round(amount / 10) * 10
  }
}
