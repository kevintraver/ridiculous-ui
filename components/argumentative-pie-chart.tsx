'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { LabelList, Pie, PieChart, Cell } from 'recharts'
import { TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

// Initial data
const chartData = [
  { category: 'marketing', value: 35, fill: 'hsl(var(--chart-1))' },
  { category: 'development', value: 25, fill: 'hsl(var(--chart-2))' },
  { category: 'finance', value: 15, fill: 'hsl(var(--chart-3))' },
  { category: 'operations', value: 15, fill: 'hsl(var(--chart-4))' },
  { category: 'hr', value: 10, fill: 'hsl(var(--chart-5))' }
]

// Chart configuration
const chartConfig = {
  value: { label: 'Budget %' },
  marketing: { label: 'Marketing', color: 'hsl(var(--chart-1))' },
  development: { label: 'Development', color: 'hsl(var(--chart-2))' },
  finance: { label: 'Finance', color: 'hsl(var(--chart-3))' },
  operations: { label: 'Operations', color: 'hsl(var(--chart-4))' },
  hr: { label: 'HR', color: 'hsl(var(--chart-5))' }
} satisfies ChartConfig

export default function ArgumentativePieChart() {
  const [chartDataState, setChartDataState] = useState([...chartData])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Handle slice hover
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }
  const onPieLeave = () => {
    setActiveIndex(null)
  }

  // Faster, more dramatic animation: update chart data automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setChartDataState(prev => {
        const newData = [...prev]
        const slice1 = Math.floor(Math.random() * newData.length)
        let slice2 = Math.floor(Math.random() * newData.length)
        while (slice2 === slice1) {
          slice2 = Math.floor(Math.random() * newData.length)
        }
        const amountToTake = Math.random() * 10 + 3 // 3-13% shift
        if (newData[slice2].value - amountToTake >= 5) {
          newData[slice1].value += amountToTake
          newData[slice2].value -= amountToTake
        }
        const total = newData.reduce((acc, curr) => acc + curr.value, 0)
        return newData.map(item => ({
          ...item,
          value: (item.value / total) * 100
        }))
      })
    }, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className='flex flex-col w-full max-w-sm mx-auto'>
      <CardHeader className='items-center pb-0 p-4'>
        <CardTitle className='text-center'>Pie Chart - Label List</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[150px] px-0 overflow-visible'
        >
          <PieChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            style={{ overflow: 'visible' }}
          >
            <ChartTooltip
              content={<ChartTooltipContent nameKey='value' hideLabel />}
            />
            <Pie data={chartDataState} dataKey='value' nameKey='category'>
              <LabelList
                dataKey='category'
                className='fill-background'
                stroke='none'
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
              {chartDataState.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
