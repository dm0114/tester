import type { Meta, StoryObj } from '@storybook/react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const employees = [
  { id: 'EMP001', name: 'John Doe', department: 'Engineering', status: 'Active' },
  { id: 'EMP002', name: 'Jane Smith', department: 'Design', status: 'Active' },
  { id: 'EMP003', name: 'Bob Wilson', department: 'Marketing', status: 'On Leave' },
  { id: 'EMP004', name: 'Alice Brown', department: 'HR', status: 'Active' },
]

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((emp) => (
          <TableRow key={emp.id}>
            <TableCell className="font-medium">{emp.id}</TableCell>
            <TableCell>{emp.name}</TableCell>
            <TableCell>{emp.department}</TableCell>
            <TableCell>{emp.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>Employee directory as of December 2024</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((emp) => (
          <TableRow key={emp.id}>
            <TableCell className="font-medium">{emp.id}</TableCell>
            <TableCell>{emp.name}</TableCell>
            <TableCell>{emp.department}</TableCell>
            <TableCell>{emp.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

const payrollData = [
  { name: 'John Doe', baseSalary: 5000, bonus: 500, total: 5500 },
  { name: 'Jane Smith', baseSalary: 5500, bonus: 600, total: 6100 },
  { name: 'Bob Wilson', baseSalary: 4800, bonus: 400, total: 5200 },
]

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead className="text-right">Base Salary</TableHead>
          <TableHead className="text-right">Bonus</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payrollData.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell className="text-right">${row.baseSalary.toLocaleString()}</TableCell>
            <TableCell className="text-right">${row.bonus.toLocaleString()}</TableCell>
            <TableCell className="text-right">${row.total.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Payroll</TableCell>
          <TableCell className="text-right">
            ${payrollData.reduce((sum, row) => sum + row.total, 0).toLocaleString()}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Department</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
            No employees found
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
