import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, TrendingUp, MessageSquare, Plus, Star, BarChart3 } from 'lucide-react'
import { useEtfContext } from '../context/EtfContext'
import { useEtfDetailData } from '../hooks/useEtfDetailData'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Scatter
} from 'recharts'
import { EtfDailyData, EtfIndicators, EtfClawSignal, TradeRecord, EtfMomentumSignal, EtfNote } from '../types'
import { formatPercent, formatDate, getChangeColor, resolveTechDirection, formatTechDirection, type TechDirection } from '../utils/formatters'
import { ButterworthFit, EtfWithData } from '../types'
import { useEtfNotesBySymbol } from '../hooks/useEtfNotes'
import { useTradeRecords } from '../hooks/useTradeRecords'
import { usePersistentState } from '../hooks/usePersistentState'
import { NoteItem } from '../components/NoteItem'
import { NoteModal, type TradeAction, type NoteModalInitialValues } from '../components/NoteModal'
import { TradeRecordItem } from '../components/TradeRecordItem'
import { TradeModal } from '../components/TradeModal'
import { SellConfirmModal } from '../components/SellConfirmModal'

const MainChart: React.FC<{ dailyData: EtfDailyData[]; indicators: EtfIndicators[]; signals: EtfClawSignal[]; butterworthFit: ButterworthFit[]; tradeRecords: TradeRecord[] }> = ({ dailyData, indicators, signals, butterworthFit, tradeRecords }) => {
  const indicatorMap = new Map(indicators.map(d => [d.trade_date, d]))
  const signalMap = new Map<string, EtfClawSignal>()
  signals.forEach(sig => {
    signalMap.set(sig.trade_date, sig)
  })
  // 交易记录按日期分组
  const tradeRecordMap = new Map<string, TradeRecord[]>()
  tradeRecords.forEach(record => {
    const arr = tradeRecordMap.get(record.trade_date) || []
    arr.push(record)
    tradeRecordMap.set(record.trade_date, arr)
  })
  // 拟合数据按 trade_date 索引
  const fitMap = new Map<string, ButterworthFit>()
  butterworthFit.forEach(f => fitMap.set(f.trade_date, f))
  
  const chartData = useMemo(() => {
    const reversed = [...dailyData].reverse()
    return reversed.map((d, i) => {
      const indicator = indicatorMap.get(d.trade_date)
      const signal = signalMap.get(d.trade_date)
      const fit = fitMap.get(d.trade_date)
      const prevClose = i > 0 ? reversed[i - 1].close : null
      const changePct = prevClose && prevClose > 0 && d.close != null
        ? ((d.close - prevClose) / prevClose) * 100
        : null
      return {
        date: formatDate(d.trade_date),
        trade_date: d.trade_date,
        open: d.open ?? 0,
        high: d.high ?? 0,
        low: d.low ?? 0,
        close: d.close ?? 0,
        isUp: (d.close ?? 0) >= (d.open ?? 0),
        bodyTop: Math.max(d.open ?? 0, d.close ?? 0),
        bodyBottom: Math.min(d.open ?? 0, d.close ?? 0),
        ma5: indicator?.ma5,
        ma10: indicator?.ma10,
        ma20: indicator?.ma20,
        ma60: indicator?.ma60,
        volume: d.volume ?? 0,
        value: d.high ?? 0,
        signal,
        signalAction: signal?.action,
        signalActionType: signal?.action_type,
        signalScore: signal?.signal_score,
        eventBuyCount: signal?.event_buy_count,
        eventSellCount: signal?.event_sell_count,
        eventBuySignals: signal?.event_buy_signals,
        eventSellSignals: signal?.event_sell_signals,
        stateBuyCount: signal?.state_buy_count,
        stateSellCount: signal?.state_sell_count,
        stateBuySignals: signal?.state_buy_signals,
        stateSellSignals: signal?.state_sell_signals,
        signalK: signal?.k,
        signalD: signal?.d,
        signalJ: signal?.j,
        signalRsi: signal?.rsi,
        signalMacd: signal?.macd_hist,
        fitted: fit?.fitted ?? null,
        changePct,
      }
    })
  }, [dailyData, indicators, signals, butterworthFit, tradeRecords])

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center min-h-[300px] text-gray-500 text-sm">暂无数据</div>
  }

  const prices = chartData.flatMap(d => [
    d.high,
    d.low,
    ...(d.fitted != null ? [d.fitted] : [])
  ])
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const padding = (maxPrice - minPrice) * 0.1

  const CustomBar = ({ x, y, width, height, payload }: any) => {
    if (!payload) return <g />
    
    const color = payload.isUp ? '#ef4444' : '#22c55e'
    const domainLow = minPrice - padding
    const domainHigh = maxPrice + padding
    const domainRange = domainHigh - domainLow

    // Recharts: y = 当前k线high值的Y坐标, y + height = 图表底部Y坐标(=domainLow)
    // 据此推算整图的像素高度和顶部Y坐标, 用于任意价格→Y坐标映射
    const barValue = payload.high ?? 0
    const chartBottomY = y + height
    const pixelsPerPriceUnit = height / Math.max(barValue - domainLow, 0.0001)
    const chartPixelHeight = domainRange * pixelsPerPriceUnit
    const chartTopY = chartBottomY - chartPixelHeight

    const getY = (price: number) => {
      return chartTopY + chartPixelHeight * (domainHigh - price) / domainRange
    }
    
    const highY = getY(payload.high)
    const lowY = getY(payload.low)
    const bodyTopY = getY(payload.bodyTop)
    const bodyBottomY = getY(payload.bodyBottom)
    const bodyHeight = Math.abs(bodyBottomY - bodyTopY) || 1
    
    const signal = signalMap.get(payload.trade_date)
    const trades = tradeRecordMap.get(payload.trade_date) || []

    // 策略信号标记（三角）—— 使用新的双维度决策逻辑
    let signalMark = null
    if (signal) {
      const dir: TechDirection = resolveTechDirection(signal)
      const markerX = x + width / 2
      if (dir === 'buy') {
        signalMark = (
          <path
            d={`M${markerX},${lowY + 8} L${markerX - 5},${lowY + 16} L${markerX + 5},${lowY + 16} Z`}
            fill="#ef4444"
          />
        )
      } else if (dir === 'sell') {
        signalMark = (
          <path
            d={`M${markerX},${highY - 8} L${markerX - 5},${highY - 16} L${markerX + 5},${highY - 16} Z`}
            fill="#22c55e"
          />
        )
      }
    }

    // 实际交易记录标记（文字）
    let tradeMarks = null
    if (trades.length > 0) {
      const markerX = x + width / 2
      const marks = trades.map((trade) => {
        if (trade.direction === 'buy') {
          return (
            <text key={trade.id} x={markerX} y={lowY + 28} textAnchor="middle" fontSize={9} fill="#f97316" fontWeight="bold">买入</text>
          )
        } else {
          return (
            <text key={trade.id} x={markerX} y={highY - 18} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight="bold">卖出</text>
          )
        }
      })
      tradeMarks = <g>{marks}</g>
    }

    return (
      <g>
        <line
          x1={x + width / 2}
          y1={highY}
          x2={x + width / 2}
          y2={lowY}
          stroke={color}
          strokeWidth={1}
        />
        <rect
          x={x}
          y={bodyTopY}
          width={width}
          height={bodyHeight}
          fill={color}
        />
        {signalMark}
        {tradeMarks}
      </g>
    )
  }

  return (
    <div className="h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={chartData} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => v.slice(5)}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minPrice - padding, maxPrice + padding]}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => v.toFixed(2)}
          />
          <Tooltip
            position={{ y: 0 }}
            offset={10}
            allowEscapeViewBox={{ x: true, y: false }}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', border: '1px solid rgba(229, 231, 235, 0.6)', borderRadius: '8px', backdropFilter: 'blur(2px)' }}
            wrapperStyle={{ pointerEvents: 'none', zIndex: 50 }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                open: '开盘',
                high: '最高',
                low: '最低',
                close: '收盘',
                ma5: 'MA5',
                ma10: 'MA10',
                ma20: 'MA20',
                ma60: 'MA60',
                fitted: '拟合值'
              }
              return [value?.toFixed(2) || '--', labels[name] || name]
            }}
            content={({ payload }: any) => {
              if (!payload || !payload[0]) return null
              const data = payload[0].payload
              // Tooltip 信号数据直接从 signalMap 取原始 EtfClawSignal 对象
              // → 与 CustomBar 三角标记的信号源 100% 同源，不受 Recharts payload 序列化影响
              const sig: EtfClawSignal | undefined = data.trade_date ? signalMap.get(data.trade_date) : undefined
              const signalAction = sig?.action ?? data.signalAction
              const signalActionType = sig?.action_type ?? data.signalActionType
              const signalScore = sig?.signal_score ?? data.signalScore
              const eventBuyCount = sig?.event_buy_count ?? data.eventBuyCount
              const eventSellCount = sig?.event_sell_count ?? data.eventSellCount
              const eventBuySignals = sig?.event_buy_signals ?? data.eventBuySignals
              const eventSellSignals = sig?.event_sell_signals ?? data.eventSellSignals
              const stateBuyCount = sig?.state_buy_count ?? data.stateBuyCount
              const stateSellCount = sig?.state_sell_count ?? data.stateSellCount
              const stateBuySignals = sig?.state_buy_signals ?? data.stateBuySignals
              const stateSellSignals = sig?.state_sell_signals ?? data.stateSellSignals
              const signalK = sig?.k ?? data.signalK
              const signalD = sig?.d ?? data.signalD
              const signalJ = sig?.j ?? data.signalJ
              const signalRsi = sig?.rsi ?? data.signalRsi
              const signalMacd = sig?.macd_hist ?? data.signalMacd
              return (
                <div className="bg-white/60 border border-gray-300/60 rounded-lg shadow-lg p-3 min-w-[200px] max-w-[260px] backdrop-blur-sm">
                  <div className="text-gray-600 text-sm mb-2">{data.date}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="text-gray-500">开盘:</span>
                    <span className="text-right font-medium">{data.open?.toFixed(3)}</span>
                    <span className="text-gray-500">最高:</span>
                    <span className="text-right font-medium">{data.high?.toFixed(3)}</span>
                    <span className="text-gray-500">最低:</span>
                    <span className="text-right font-medium">{data.low?.toFixed(3)}</span>
                    <span className="text-gray-500">收盘:</span>
                    <span className="text-right font-medium">
                      {data.close?.toFixed(3)}
                      {data.changePct != null && (
                        <span className={`ml-2 ${data.changePct >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {data.changePct >= 0 ? '+' : ''}{data.changePct.toFixed(2)}%
                        </span>
                      )}
                    </span>
                    <span className="text-gray-500">MA5:</span>
                    <span className="text-right font-medium">{data.ma5?.toFixed(3) || '--'}</span>
                    <span className="text-gray-500">MA10:</span>
                    <span className="text-right font-medium">{data.ma10?.toFixed(3) || '--'}</span>
                    <span className="text-gray-500">MA20:</span>
                    <span className="text-right font-medium">{data.ma20?.toFixed(3) || '--'}</span>
                    <span className="text-gray-500">MA60:</span>
                    <span className="text-right font-medium">{data.ma60?.toFixed(3) || '--'}</span>
                    {(data.fitted != null) && (
                      <>
                        <span className="text-gray-500">拟合值:</span>
                        <span className="text-right font-medium text-indigo-400">{data.fitted?.toFixed(3) || '--'}</span>
                      </>
                    )}
                  </div>
                  {(signalActionType || signalAction || signalScore != null || eventBuyCount != null || eventSellCount != null || stateBuyCount != null || stateSellCount != null || eventBuySignals || eventSellSignals || stateBuySignals || stateSellSignals) && (
                    <div className="mt-3 pt-2 border-t border-gray-200 space-y-2.5">
                      {(() => {
                        const dir: TechDirection = resolveTechDirection(sig ?? {
                          action_type: signalActionType,
                          action: signalAction,
                          signal_score: signalScore,
                          event_buy_count: eventBuyCount,
                          event_sell_count: eventSellCount,
                        })
                        const display = formatTechDirection(dir)
                        const dirBadgeClass =
                          dir === 'buy' ? 'bg-red-50 border-red-200 text-red-700' :
                          dir === 'sell' ? 'bg-green-50 border-green-200 text-green-700' :
                          'bg-blue-50 border-blue-200 text-blue-700'

                        const evtBuyN = eventBuyCount != null ? Number(eventBuyCount) : null
                        const evtSellN = eventSellCount != null ? Number(eventSellCount) : null
                        const stBuyN = stateBuyCount != null ? Number(stateBuyCount) : null
                        const stSellN = stateSellCount != null ? Number(stateSellCount) : null
                        const evtDiff = (evtBuyN != null && evtSellN != null) ? evtBuyN - evtSellN : null
                        const score = (signalScore != null && signalScore !== '') ? Number(signalScore) : null

                        return (
                          <>
                            {/* ① 结论（action_type） */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">结论 (action_type)</span>
                              <div className="flex items-center gap-1.5">
                                {signalActionType && (
                                  <span className="px-1.5 py-0.5 rounded border text-[11px] font-medium text-gray-600 border-gray-200 bg-gray-50">
                                    {signalActionType}
                                  </span>
                                )}
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border ${dirBadgeClass}`}>
                                  {display}
                                </span>
                              </div>
                            </div>

                            {/* ② 评分强度 (signal_score) */}
                            {(signalScore != null && signalScore !== '') && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">评分强度 (signal_score)</span>
                                <span className={`font-semibold ${
                                  score != null && score >= 40 ? 'text-red-600' :
                                  score != null && score <= -40 ? 'text-green-600' :
                                  'text-gray-700'
                                }`}>
                                  {score != null ? `${score >= 0 ? '+' : ''}${score.toFixed(0)}` : '--'}
                                </span>
                              </div>
                            )}

                            {/* ③ 事件类信号卡片（计数 + 明细在一起，参与决策） */}
                            {((evtBuyN != null && evtBuyN > 0) || (evtSellN != null && evtSellN > 0) || eventBuySignals || eventSellSignals) && (
                              <div className="rounded-md border border-amber-200 bg-amber-50/60 p-2 space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-amber-700">事件类信号</span>
                                  <span className="text-gray-700 font-medium">
                                    <span className="text-green-600">{evtBuyN ?? 0} 买</span>
                                    {' / '}
                                    <span className="text-red-600">{evtSellN ?? 0} 卖</span>
                                    {evtDiff != null && (
                                      <span className="ml-1.5 text-gray-400">(差 {evtDiff >= 0 ? '+' : ''}{evtDiff})</span>
                                    )}
                                  </span>
                                </div>
                                {eventBuySignals && (
                                  <div>
                                    <div className="text-xs font-medium text-green-600 mb-0.5">买入 ({evtBuyN ?? 0})</div>
                                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                      {eventBuySignals}
                                    </div>
                                  </div>
                                )}
                                {eventSellSignals && (
                                  <div>
                                    <div className="text-xs font-medium text-red-600 mb-0.5">卖出 ({evtSellN ?? 0})</div>
                                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                      {eventSellSignals}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* ④ 状态类信号卡片（计数 + 明细在一起，仅展示参考） */}
                            {((stBuyN != null && stBuyN > 0) || (stSellN != null && stSellN > 0) || stateBuySignals || stateSellSignals) && (
                              <div className="rounded-md border border-slate-200 bg-slate-50/60 p-2 space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-slate-600">状态类信号</span>
                                  <span className="text-gray-700 font-medium">
                                    <span className="text-green-600">{stBuyN ?? 0} 买</span>
                                    {' / '}
                                    <span className="text-red-600">{stSellN ?? 0} 卖</span>
                                  </span>
                                </div>
                                {stateBuySignals && (
                                  <div>
                                    <div className="text-xs font-medium text-green-600 mb-0.5">买入 ({stBuyN ?? 0})</div>
                                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                      {stateBuySignals}
                                    </div>
                                  </div>
                                )}
                                {stateSellSignals && (
                                  <div>
                                    <div className="text-xs font-medium text-red-600 mb-0.5">卖出 ({stSellN ?? 0})</div>
                                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                      {stateSellSignals}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 技术指标参考值（折叠在最下） */}
                            {((signalK != null || signalD != null || signalJ != null) || signalRsi != null || signalMacd != null) && (
                              <div className="pt-2 mt-1 border-t border-gray-100 text-xs text-gray-500 space-y-0.5">
                                {(signalK != null || signalD != null || signalJ != null) && (
                                  <div>KDJ: K {signalK?.toFixed(1)} / D {signalD?.toFixed(1)} / J {signalJ?.toFixed(1)}</div>
                                )}
                                {signalRsi != null && <div>RSI: {signalRsi.toFixed(1)}</div>}
                                {signalMacd != null && <div>MACD柱: {signalMacd.toFixed(3)}</div>}
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  )}
                </div>
              )
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} payload={[
            { value: 'MA5', type: 'line', color: '#f59e0b' },
            { value: 'MA10', type: 'line', color: '#8b5cf6' },
            { value: 'MA20', type: 'line', color: '#06b6d4' },
            { value: 'MA60', type: 'line', color: '#ec4899' },
            { value: '拟合值', type: 'line', color: '#c4b5fd' },
          ]} />
          
          <Bar dataKey="value" barSize={5} shape={<CustomBar />} name="K线" legendType="none" />
          
          <Line type="monotone" dataKey="ma5" stroke="#f59e0b" dot={false} strokeWidth={1} name="MA5" />
          <Line type="monotone" dataKey="ma10" stroke="#8b5cf6" dot={false} strokeWidth={1} name="MA10" />
          <Line type="monotone" dataKey="ma20" stroke="#06b6d4" dot={false} strokeWidth={1} name="MA20" />
          <Line type="monotone" dataKey="ma60" stroke="#ec4899" dot={false} strokeWidth={1} name="MA60" />
          
          {/* Butterworth 拟合曲线 */}
          <Line type="monotone" dataKey="fitted" stroke="#c4b5fd" dot={false} strokeWidth={1} name="拟合值" legendType="none" connectNulls={true} />
          
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const VolumeChart: React.FC<{ data: EtfDailyData[] }> = ({ data }) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map(d => ({
      date: formatDate(d.trade_date),
      volume: d.volume ?? 0,
      isUp: (d.close ?? 0) >= (d.open ?? 0),
      value: d.volume ?? 0
    }))
  }, [data])

  if (chartData.length === 0) {
    return <div className="h-16 flex items-center justify-center text-gray-500 text-sm">暂无数据</div>
  }

  return (
    <div className="h-24 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => (v / 10000).toFixed(0) + '万'} />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', border: '1px solid rgba(229, 231, 235, 0.6)', borderRadius: '8px', fontSize: 12, backdropFilter: 'blur(2px)' }}
            wrapperStyle={{ pointerEvents: 'none', zIndex: 50 }}
            formatter={(value: number) => [(value / 10000).toFixed(0) + ' 万份', '成交量']}
          />
          <Bar dataKey="value" barSize={5} shape={(props: any) => {
            const { x, y, width, height, payload } = props
            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={payload.isUp ? '#ef4444' : '#22c55e'}
              />
            )
          }} name="成交量" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const DerivativeChart: React.FC<{ butterworthFit: ButterworthFit[] }> = ({ butterworthFit }) => {
  const chartData = useMemo(() => {
    const sorted = [...butterworthFit].sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())
    return sorted.map((d) => {
      const derivative = d.derivative
      const ts = d.trend_signal?.toUpperCase()
      const signalY = derivative ?? 0
      const point: any = {
        date: formatDate(d.trade_date),
        positive: derivative != null && derivative > 0 ? derivative : null,
        negative: derivative != null && derivative < 0 ? derivative : null,
      }
      if (ts === 'BUY') point.buySignal = signalY
      if (ts === 'SELL') point.sellSignal = signalY
      return point
    })
  }, [butterworthFit])

  // 过滤出只有 buySignal / sellSignal 的点（用于 shape 函数判断）
  const hasBuySignal = useMemo(() => new Set(chartData.filter(d => d.buySignal != null).map(d => d.date)), [chartData])
  const hasSellSignal = useMemo(() => new Set(chartData.filter(d => d.sellSignal != null).map(d => d.date)), [chartData])

  if (typeof window !== 'undefined') {
    console.log('[DerivativeChart] BUY信号数:', hasBuySignal.size, 'SELL信号数:', hasSellSignal.size, '总数据:', chartData.length)
    if (butterworthFit.length > 0) {
      console.log('[DerivativeChart] 原始数据样例:', {
        trade_date: butterworthFit[0].trade_date,
        derivative: butterworthFit[0].derivative,
        trend_signal: butterworthFit[0].trend_signal,
        fitted: butterworthFit[0].fitted,
      })
      const firstSignal = butterworthFit.find(d => d.trend_signal != null)
      console.log('[DerivativeChart] 第一个有信号的数据:', firstSignal)
    }
  }

  if (chartData.length === 0) {
    return <div className="h-16 flex items-center justify-center text-gray-500 text-sm">暂无数据</div>
  }

  // 买入：红色正三角（箭头朝上），放柱状图下方
  const BuyShape = (props: any) => {
    const { cx, cy, payload } = props
    if (cx == null || cy == null || !payload?.buySignal) return <g />
    const size = 6
    const offsetY = size + 2
    const points = `${cx},${cy + offsetY - size} ${cx - size},${cy + offsetY + size} ${cx + size},${cy + offsetY + size}`
    return <polygon points={points} fill="#ef4444" />
  }
  // 卖出：绿色倒三角（箭头朝下），放柱状图上方
  const SellShape = (props: any) => {
    const { cx, cy, payload } = props
    if (cx == null || cy == null || !payload?.sellSignal) return <g />
    const size = 6
    const offsetY = size + 2
    const points = `${cx},${cy - offsetY + size} ${cx - size},${cy - offsetY - size} ${cx + size},${cy - offsetY - size}`
    return <polygon points={points} fill="#22c55e" />
  }

  return (
    <div className="h-24 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', border: '1px solid rgba(229, 231, 235, 0.6)', borderRadius: '8px', fontSize: 12, backdropFilter: 'blur(2px)' }}
            wrapperStyle={{ pointerEvents: 'none', zIndex: 50 }}
            formatter={(value: any, name: string) => {
              if (name === '买入' || name === '卖出') return [name, '交易信号']
              return [Number(value).toFixed(4), '一阶导数']
            }}
          />
          <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
          <Bar dataKey="positive" stackId="derivative" barSize={4} fill="#ef4444" fillOpacity={0.7} name="上升" />
          <Bar dataKey="negative" stackId="derivative" barSize={4} fill="#22c55e" fillOpacity={0.7} name="下降" />
          <Scatter dataKey="buySignal" fill="#ef4444" shape={BuyShape} name="买入" />
          <Scatter dataKey="sellSignal" fill="#22c55e" shape={SellShape} name="卖出" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const MomentumScoreChart: React.FC<{ data: EtfMomentumSignal[] }> = ({ data }) => {
  const chartData = useMemo(() => {
    return [...data].reverse().map(d => ({
      date: formatDate(d.trade_date),
      final_score: d.final_score,
      regression_score: d.regression_score,
      multi_period_score: d.multi_period_score,
      risk_adjusted_score: d.risk_adjusted_score,
      technical_score: d.technical_score,
    }))
  }, [data])

  if (chartData.length === 0) {
    return <div className="h-48 flex items-center justify-center text-gray-500 text-sm">暂无数据</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', border: '1px solid rgba(229, 231, 235, 0.6)', borderRadius: '8px', fontSize: 12, backdropFilter: 'blur(2px)' }}
            wrapperStyle={{ pointerEvents: 'none', zIndex: 50 }}
            formatter={(value: any, name: string) => {
              const labels: Record<string, string> = {
                final_score: '综合评分',
                regression_score: '回归评分',
                multi_period_score: '多周期评分',
                risk_adjusted_score: '风险调整评分',
                technical_score: '技术面评分',
              }
              return [value != null ? Number(value).toFixed(2) : '--', labels[name] || name]
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} payload={[
            { value: '综合评分', type: 'line', color: '#8b5cf6' },
            { value: '回归评分', type: 'line', color: '#f59e0b' },
            { value: '多周期评分', type: 'line', color: '#06b6d4' },
            { value: '风险调整评分', type: 'line', color: '#ec4899' },
            { value: '技术面评分', type: 'line', color: '#22c55e' },
          ]} />
          <Line type="monotone" dataKey="final_score" stroke="#8b5cf6" strokeWidth={2} dot={false} name="综合评分" />
          <Line type="monotone" dataKey="regression_score" stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="3 3" name="回归评分" />
          <Line type="monotone" dataKey="multi_period_score" stroke="#06b6d4" strokeWidth={1.5} dot={false} strokeDasharray="3 3" name="多周期评分" />
          <Line type="monotone" dataKey="risk_adjusted_score" stroke="#ec4899" strokeWidth={1.5} dot={false} strokeDasharray="3 3" name="风险调整评分" />
          <Line type="monotone" dataKey="technical_score" stroke="#22c55e" strokeWidth={1.5} dot={false} strokeDasharray="3 3" name="技术面评分" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const EtfDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { etfs, priceByDateMap, momentumSignals, toggleFocus } = useEtfContext()

  // 按需加载详情页数据
  const { dailyData, indicators, signals, butterworthFit, momentumHistory, loading: detailLoading } = useEtfDetailData(code)

  // 获取交易记录
  const { records } = useTradeRecords()

  const etf = useMemo(() => {
    return etfs.find(e => e.symbol === code) || null
  }, [etfs, code])

  // 筛选当前ETF的交易记录
  const tradeRecords = useMemo(() => {
    if (!code) return []
    return records.filter(r => r.symbol.toUpperCase() === code.toUpperCase())
  }, [records, code])

  // dailyData, indicators, signals, butterworthFit 现在从 useEtfDetailData 获取

  const momentumSignal = useMemo(() => {
    if (!momentumSignals || momentumSignals.length === 0 || !code) return null
    const latestDate = momentumSignals[0]?.trade_date
    return momentumSignals.find(s => s.trade_date === latestDate && s.symbol === code) || null
  }, [momentumSignals, code])

  // 读取与关注ETF列表页相同的持久化筛选条件（sessionStorage），保证上翻下翻顺序一致
  const [searchText] = usePersistentState('etf_filter_searchText', '')
  const [focusFilter] = usePersistentState<'all' | 'focused'>('etf_filter_focusFilter', 'all')
  const [signalFilter] = usePersistentState<'all' | 'sell' | 'buy' | 'watch'>('etf_filter_signalFilter', 'all')
  const [categoryFilter] = usePersistentState<string>('etf_filter_categoryFilter', 'all')

  const getActionPriority = (action: string | null | undefined, sig?: any): number => {
    const dir: TechDirection = sig
      ? resolveTechDirection({ ...sig, action })
      : (() => {
          if (!action) return 'neutral'
          const act = action.toLowerCase()
          if (act.includes('卖出') || act.includes('减仓') || act.includes('sell') || act.includes('bear')) return 'sell'
          if (act.includes('买入') || act.includes('加仓') || act.includes('buy') || act.includes('bull')) return 'buy'
          return 'neutral'
        })()
    if (dir === 'sell') return 1
    if (dir === 'buy') return 2
    return 3
  }

  // 完全复刻 EtfBoard 中的筛选+排序逻辑：先按 action 优先级分组排序，再按四类筛选条件过滤
  const sortedEtfs = useMemo(() => {
    const sorted = [...etfs].sort((a, b) => {
      const priorityA = getActionPriority(a.latest_signal?.action, a.latest_signal)
      const priorityB = getActionPriority(b.latest_signal?.action, b.latest_signal)
      return priorityA - priorityB
    })
    const sellEtfs = sorted.filter(e => getActionPriority(e.latest_signal?.action, e.latest_signal) === 1)
    const buyEtfs = sorted.filter(e => getActionPriority(e.latest_signal?.action, e.latest_signal) === 2)
    const watchEtfs = sorted.filter(e => getActionPriority(e.latest_signal?.action, e.latest_signal) === 3)

    const applyFilters = (list: EtfWithData[], signalType: 'sell' | 'buy' | 'watch') => {
      if (signalFilter !== 'all' && signalFilter !== signalType) return [] as EtfWithData[]
      let result = list
      if (focusFilter === 'focused') {
        result = result.filter(e => e.is_focused)
      }
      if (categoryFilter !== 'all') {
        result = result.filter(e => e.strategy_type === categoryFilter)
      }
      if (searchText.trim()) {
        const kw = searchText.toLowerCase()
        result = result.filter(e =>
          (e.name && e.name.toLowerCase().includes(kw)) ||
          (e.symbol && e.symbol.toLowerCase().includes(kw))
        )
      }
      return result
    }

    const filteredSell = applyFilters(sellEtfs, 'sell')
    const filteredBuy = applyFilters(buyEtfs, 'buy')
    const filteredWatch = applyFilters(watchEtfs, 'watch')

    // 过滤后的顺序与关注ETF列表页表格渲染顺序保持一致：卖出 → 买入 → 观望
    const merged = [...filteredSell, ...filteredBuy, ...filteredWatch]

    // 兜底：如果当前 code ETF 不在筛选结果中（例如跳进来后用户改了条件），把它所在的原始分组也追加上，避免前后翻页找不到
    if (code && merged.findIndex(e => e.symbol === code) === -1) {
      const idxInAll = sorted.findIndex(e => e.symbol === code)
      if (idxInAll !== -1) {
        const extraSorted = [...sorted].slice(idxInAll)
        return [...merged, ...extraSorted.filter(e => !merged.find(m => m.symbol === e.symbol))]
      }
    }
    return merged
  }, [etfs, searchText, focusFilter, signalFilter, categoryFilter, code])

  const etfSymbols = sortedEtfs.map(e => e.symbol)
  const currentIndex = etfSymbols.indexOf(code || '')
  const prevEtf = currentIndex > 0 ? sortedEtfs[currentIndex - 1] : null
  const nextEtf = currentIndex < etfSymbols.length - 1 ? sortedEtfs[currentIndex + 1] : null

  // etf 列表加载完成后再显示
  if (etfs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (!etf) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">ETF不存在</div>
      </div>
    )
  }

  const latestDaily = dailyData[0]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            const lastTab: string | null = (() => {
              try { return localStorage.getItem('home_last_tab') } catch { return null }
            })()
            if (lastTab === 'trade') navigate('/')
            else if (lastTab === 'stock') navigate('/stocks')
            else navigate('/etf')
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>
        
        <div className="flex gap-3">
          {prevEtf && (
            <button
              onClick={() => navigate(`/etf/${prevEtf.symbol}`)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors text-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              上翻
            </button>
          )}
          {nextEtf && (
            <button
              onClick={() => navigate(`/etf/${nextEtf.symbol}`)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors text-sm"
            >
              下翻
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-1">
              {etf.name || etf.symbol}
              <button
                onClick={() => toggleFocus(etf.symbol)}
                className={`p-0.5 rounded transition-colors ${
                  etf.is_focused
                    ? 'text-yellow-500 hover:text-yellow-600'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
                title={etf.is_focused ? '取消重点跟踪' : '设为重点跟踪'}
              >
                <Star className={`h-4 w-4 ${etf.is_focused ? 'fill-current' : ''}`} />
              </button>
            </h1>
            <div className="text-gray-500 text-sm mt-0.5">{etf.symbol}</div>
            {etf.strategy_type && (
              <div className="text-xs text-gray-600 mt-1">{etf.strategy_type}</div>
            )}
            {etf.tracking_index_name && (
              <div className="text-xs text-gray-500 mt-0.5">跟踪: {etf.tracking_index_name}</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {latestDaily?.close != null ? latestDaily.close.toFixed(3) : '--'}
            </div>
            {latestDaily?.change_pct != null && (
              <div className={`text-lg font-semibold mt-0.5 ${getChangeColor(latestDaily.change_pct)}`}>
                {formatPercent(latestDaily.change_pct)}
              </div>
            )}
          </div>
        </div>
        {(() => {
          const v = etf.latest_index_valuation
          const hasPE = v?.pe != null
          const hasPB = v?.pb != null
          const hasChange5d = latestDaily?.change_5d != null
          const hasClosePercentile = latestDaily?.close_percentile_6m != null
          const hasVolumePercentile = latestDaily?.volume_percentile_6m != null
          const hasMomentum = !!momentumSignal
          if (!hasPE && !hasPB && !hasChange5d && !hasClosePercentile && !hasVolumePercentile && !hasMomentum) return null
          return (
            <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-gray-100">
              {hasChange5d && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">5日涨跌</span>
                  <span className={`text-sm font-semibold ${getChangeColor(latestDaily!.change_5d)}`}>
                    {formatPercent(latestDaily!.change_5d)}
                  </span>
                </div>
              )}
              {hasClosePercentile && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">价格分位</span>
                  <span className={`text-sm font-semibold ${
                    latestDaily!.close_percentile_6m! * 100 <= 30 ? 'text-green-600' :
                    latestDaily!.close_percentile_6m! * 100 >= 70 ? 'text-red-600' :
                    'text-gray-700'
                  }`}>
                    {(latestDaily!.close_percentile_6m! * 100).toFixed(1)}%
                  </span>
                </div>
              )}
              {hasVolumePercentile && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">量能分位</span>
                  <span className={`text-sm font-semibold ${
                    latestDaily!.volume_percentile_6m! * 100 <= 30 ? 'text-green-600' :
                    latestDaily!.volume_percentile_6m! * 100 >= 70 ? 'text-red-600' :
                    'text-gray-700'
                  }`}>
                    {(latestDaily!.volume_percentile_6m! * 100).toFixed(1)}%
                  </span>
                </div>
              )}
              {hasPE && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">PE</span>
                  <span className="text-sm font-semibold text-gray-900">{v!.pe!.toFixed(2)}</span>
                  {v!.pe_percent != null && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      v!.pe_percent <= 30 ? 'bg-green-100 text-green-700' :
                      v!.pe_percent >= 70 ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {v!.pe_percent.toFixed(1)}%
                    </span>
                  )}
                </div>
              )}
              {hasPB && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">PB</span>
                  <span className="text-sm font-semibold text-gray-900">{v!.pb!.toFixed(2)}</span>
                  {v!.pb_percent != null && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      v!.pb_percent <= 30 ? 'bg-green-100 text-green-700' :
                      v!.pb_percent >= 70 ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {v!.pb_percent.toFixed(1)}%
                    </span>
                  )}
                </div>
              )}
              {hasMomentum && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">动量评分</span>
                  <span className={`text-sm font-semibold ${
                    momentumSignal!.final_score != null && momentumSignal!.final_score >= 0
                      ? 'text-purple-600'
                      : 'text-gray-600'
                  }`}>
                    {momentumSignal!.final_score != null ? momentumSignal!.final_score.toFixed(2) : '--'}
                  </span>
                  {momentumSignal!.rank != null && (
                    <span className="text-xs text-gray-500">排名 #{momentumSignal!.rank}</span>
                  )}
                  {momentumSignal!.selected === true && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">入选</span>
                  )}
                </div>
              )}
            </div>
          )
        })()}
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          K线走势
        </h2>
        {detailLoading ? (
          <div className="flex items-center justify-center h-[380px]">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-500">加载中...</span>
            </div>
          </div>
        ) : (
          <>
            <MainChart
              dailyData={dailyData}
              indicators={indicators}
              signals={signals}
              butterworthFit={butterworthFit}
              tradeRecords={tradeRecords}
            />
            <DerivativeChart butterworthFit={butterworthFit} />
            <VolumeChart data={dailyData} />
            {momentumHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <BarChart3 className="h-3.5 w-3.5" />
                  动量评分走势（近3个月）
                </h3>
                <MomentumScoreChart data={momentumHistory} />
              </div>
            )}
          </>
        )}
      </div>

      <TradesSection symbol={etf.symbol} etfName={etf.name} currentPrice={latestDaily?.close ?? undefined} dailyData={dailyData} priceByDateMap={priceByDateMap} />

      <NotesSection symbol={etf.symbol} etfName={etf.name} closes={dailyData.map(d => d.close ?? 0)} />
    </div>
  )
}

function TradesSection({ symbol, etfName, currentPrice, dailyData, priceByDateMap }: { symbol: string; etfName: string | null; currentPrice?: number; dailyData?: EtfDailyData[]; priceByDateMap?: Map<string, Map<string, number>> }) {
  const { records, addRecord, updateRecord, deleteRecord } = useTradeRecords()
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<typeof records[0] | null>(null)
  const [sellModalOpen, setSellModalOpen] = useState(false)
  const [sellRecord, setSellRecord] = useState<typeof records[0] | null>(null)

  // 筛选当前 ETF 的交易记录
  const filteredRecords = useMemo(() => {
    return records.filter(r => r.symbol.toUpperCase() === symbol.toUpperCase())
  }, [records, symbol])

  const handleEdit = (record: typeof records[0]) => {
    setEditRecord(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这条交易记录吗？')) {
      await deleteRecord(id)
    }
  }

  const handleSell = (record: typeof records[0]) => {
    setSellRecord(record)
    setSellModalOpen(true)
  }

  const handleSellConfirm = async (sellPrice: number, sellDate: string) => {
    if (!sellRecord) return
    try {
      // 先将原买入记录标记为已卖出（保留买入信息用于收益率计算）
      await updateRecord(sellRecord.id, {
        symbol: sellRecord.symbol,
        name: sellRecord.name,
        direction: 'buy',
        trade_date: sellRecord.trade_date,
        amount: sellRecord.amount,
        buy_price: sellRecord.buy_price,
        stop_loss_pct: sellRecord.stop_loss_pct,
        take_profit_pct: sellRecord.take_profit_pct,
        notes: sellRecord.notes,
        status: 'closed'
      })
      // 再新增一条卖出记录
      await addRecord({
        symbol: sellRecord.symbol,
        name: sellRecord.name,
        direction: 'sell',
        trade_date: sellDate,
        amount: sellRecord.amount,
        buy_price: sellPrice,
        stop_loss_pct: null,
        take_profit_pct: null,
        notes: null,
        status: 'closed',
        linked_id: sellRecord.id
      })
      setSellModalOpen(false)
      setSellRecord(null)
    } catch (error) {
      console.error('卖出确认失败:', error)
      alert('卖出失败，请重试')
    }
  }

  const handleSave = async (record: Omit<typeof records[0], 'id' | 'created_at' | 'status' | 'linked_id'>) => {
    if (editRecord) {
      await updateRecord(editRecord.id, record)
    } else {
      await addRecord(record)
    }
    setEditRecord(null)
  }

  // 计算持仓概览 — 只统计 status='open' 的买入记录
  const position = useMemo(() => {
    const openBuyRecords = filteredRecords.filter(r => r.direction === 'buy' && r.status === 'open')
    const totalBuy = openBuyRecords.reduce((sum, r) => sum + r.amount, 0)
    const costBasis = openBuyRecords.reduce((sum, r) => sum + (r.buy_price || 0) * r.amount, 0)
    const netPosition = totalBuy
    const costPrice = totalBuy > 0 ? costBasis / totalBuy : 0
    const latestStopLoss = openBuyRecords.find(r => r.stop_loss_pct)?.stop_loss_pct
    const latestTakeProfit = openBuyRecords.find(r => r.take_profit_pct)?.take_profit_pct

    return { totalBuy, costBasis, costPrice, netPosition, stopLossPct: latestStopLoss, takeProfitPct: latestTakeProfit }
  }, [filteredRecords])

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">交易记录</h2>
        <button
          onClick={() => { setEditRecord(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          添加
        </button>
      </div>

      {/* 持仓概览 */}
      {position.netPosition > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-500">持仓金额</div>
              <div className="font-medium">¥{position.netPosition.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">成本均价</div>
              <div className="font-medium">¥{position.costPrice.toFixed(3)}</div>
            </div>
            {currentPrice && (
              <div>
                <div className="text-xs text-gray-500">当前收益</div>
                <div className={`font-medium ${((currentPrice / position.costPrice - 1) * 100) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {((currentPrice / position.costPrice - 1) * 100).toFixed(2)}%
                </div>
              </div>
            )}
          </div>
          {(position.stopLossPct || position.takeProfitPct) && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
              {position.stopLossPct && (
                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">止损 -{position.stopLossPct}%</span>
              )}
              {position.takeProfitPct && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">止盈 +{position.takeProfitPct}%</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* 交易记录列表 */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">暂无交易记录</div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredRecords.map(record => (
            <TradeRecordItem
              key={record.id}
              record={record}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSell={handleSell}
              currentPrice={currentPrice}
              allRecords={records}
            />
          ))}
        </div>
      )}

      {/* 添加/编辑弹窗 */}
      <TradeModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditRecord(null) }}
        onSave={handleSave}
        editRecord={editRecord}
        symbolOptions={[{ symbol, name: etfName || symbol }]}
        priceMapsBySymbol={priceByDateMap}
      />

      {/* 卖出确认弹窗 */}
      <SellConfirmModal
        isOpen={sellModalOpen}
        record={sellRecord}
        currentPrice={currentPrice}
        dailyData={dailyData}
        onConfirm={handleSellConfirm}
        onClose={() => { setSellModalOpen(false); setSellRecord(null) }}
      />
    </div>
  )
}

function NotesSection({ symbol, etfName, closes }: { symbol: string; etfName: string | null; closes: number[] }) {
  const { notes, loading, addNote, updateNote, deleteNote } = useEtfNotesBySymbol(symbol)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSubmitting, setModalSubmitting] = useState(false)
  const [editingNote, setEditingNote] = useState<{
    id: number
    initial: NoteModalInitialValues
  } | null>(null)

  const handleSave = async (values: { note: string; tradeAction: TradeAction; executionPrice: number | null }) => {
    setModalSubmitting(true)
    try {
      if (editingNote) {
        const action = values.tradeAction || null
        await updateNote(editingNote.id, {
          note: values.note,
          tradeAction: action,
          executionPrice: values.executionPrice,
        })
      } else {
        const action = values.tradeAction || null
        const execPrice = (action === 'buy' || action === 'sell') ? values.executionPrice : null
        await addNote(values.note, action, execPrice)
      }
      setIsModalOpen(false)
      setEditingNote(null)
    } finally {
      setModalSubmitting(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingNote(null)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingNote(null)
  }

  const handleEdit = (note: EtfNote) => {
    setEditingNote({
      id: note.id,
      initial: {
        note: note.note,
        tradeAction: (note.trade_action as TradeAction) || '',
        executionPrice: note.execution_price != null ? note.execution_price.toString() : '',
      },
    })
    setIsModalOpen(true)
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        笔记
      </h2>

      {/* 添加按钮 */}
      <div className="mb-3">
        <button
          type="button"
          onClick={handleOpenAdd}
          className="w-full py-2 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-dashed border-blue-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          添加笔记
        </button>
      </div>

      {/* 历史笔记列表 */}
      {loading ? (
        <div className="text-sm text-gray-400 py-2">加载中...</div>
      ) : notes.length === 0 ? (
        <div className="text-sm text-gray-400 py-2">暂无笔记</div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {notes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              name={etfName}
              code={note.symbol}
              navigatePath={`/etf/${note.symbol}`}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onEdit={(n) => handleEdit(n as EtfNote)}
              compact
            />
          ))}
        </div>
      )}

      {/* 笔记弹窗 */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        title={editingNote ? '编辑笔记' : '添加笔记'}
        submitText={editingNote ? '保存修改' : '添加笔记'}
        recentCloses={closes}
        initial={editingNote?.initial}
        theme="blue"
        submitting={modalSubmitting}
      />
    </div>
  )
}

export default EtfDetail
