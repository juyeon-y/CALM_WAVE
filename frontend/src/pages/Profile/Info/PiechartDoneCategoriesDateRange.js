import React, { useState, useEffect } from "react"
import axios from "axios"
import { ResponsivePie } from "@nivo/pie"

function PiechartDoneCategoriesDateRange(props) {
  const [works, setWork] = useState([])

  const selected = props.selected
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const today = new Date()
  const dayOfWeek = today.getDay()
  const date = today.getDate()
  const hour = today.getHours()
  const year = today.getFullYear()
  const month = today.getMonth() + 1

  const daysSinceSunday = today.getDay()
  const lastSunday = new Date(today)
  lastSunday.setDate(today.getDate() - daysSinceSunday - 7)
  const lastSaturday = new Date(today)
  lastSaturday.setDate(today.getDate() - daysSinceSunday - 1)
  const thisSunday = new Date(today)
  thisSunday.setDate(today.getDate() - daysSinceSunday)
  const thisSaturday = new Date(today)
  thisSaturday.setDate(today.getDate() - daysSinceSunday + 6)

  const lastSundayStr = `${lastSunday.getFullYear()}${(
    lastSunday.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${lastSunday.getDate().toString().padStart(2, "0")}`
  const lastSaturdayStr = `${lastSaturday.getFullYear()}${(
    lastSaturday.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${lastSaturday.getDate().toString().padStart(2, "0")}`
  const thisSundayStr = `${thisSunday.getFullYear()}${(
    thisSunday.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${thisSunday.getDate().toString().padStart(2, "0")}`
  const thisSaturdayStr = `${thisSaturday.getFullYear()}${(
    thisSaturday.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${thisSaturday.getDate().toString().padStart(2, "0")}`

  const lastMonthLastDay = new Date(year, month - 1, 0)
  const lastMonthFirstDay = new Date(year, month - 2, 1)
  const thisMonthFirstDay = new Date(year, month - 1, 1)
  const thisMonthLastDay = new Date(year, month, 0)

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}${month}${day}`
  }

  const lastMonthFirstDayFormatted = formatDate(lastMonthFirstDay)
  const lastMonthLastDayFormatted = formatDate(lastMonthLastDay)
  const thisMonthFirstDayFormatted = formatDate(thisMonthFirstDay)
  const thisMonthLastDayFormatted = formatDate(thisMonthLastDay)

  useEffect(function () {
    if (selected === "?????????") {
      if (dayOfWeek === 0 && hour <= 4) {
        setStartDate(() => lastSundayStr)
        setEndDate(() => lastSaturdayStr)
      } else {
        setStartDate(() => thisSundayStr)
        setEndDate(() => thisSaturdayStr)
      }
    } else if (selected === "?????????") {
      if (date === 1 && hour < 4) {
        setStartDate(() => lastMonthFirstDayFormatted) //????????? ????????? ???
        setEndDate(() => lastMonthLastDayFormatted) //????????? ????????????
      } else {
        setStartDate(() => thisMonthFirstDayFormatted) //????????? ????????? ???
        setEndDate(() => thisMonthLastDayFormatted) //????????? ????????? ???
      }
    }
  }, [])

  useEffect(() => {
    if (startDate && endDate) {
      const fetchWork = async () => {
        try {
          const [result1, result2] = await axios.all([
            axios.get(
              `https://i8a105.p.ssafy.io/api/v1/data/mypage/done-works/${startDate}/${endDate}`
            ),
            axios.get(
              "https://i8a105.p.ssafy.io/api/v1/data/mypage/done-works/today"
            ),
          ])
          const combinedResults = [...result1.data, ...result2.data]
          setWork(combinedResults)
        } catch (error) {
        }
      }

      fetchWork()
    }
  }, [startDate, endDate])

  const handle = {
    padClick: (data) => {
    },

    legendClick: (data) => {
    },
  }

  const totalMinutes = works.reduce((acc, work) => acc + work.totalTime, 0)

  const sumByCateName = works.reduce((acc, work) => {
    if (!acc[work.cateName]) {
      acc[work.cateName] = { id: work.cateName, minutes: 0, value: 0 }
    }
    acc[work.cateName].minutes += work.totalTime
    acc[work.cateName].value = Math.round(
      (acc[work.cateName].minutes / totalMinutes) * 100
    )
    return acc
  }, {})

  return (
    // chart height??? 100%?????? ????????? chart??? ?????? ????????? ????????? height ??????
    <div style={{ width: "800px", height: "500px", margin: "0 auto" }}>
      <ResponsivePie
        /**
         * chart??? ????????? ?????????
         */

        data={Object.values(sumByCateName)}
        valueFormat={(value) => `${Number(value)}%`}
        /**
         * chart margin
         */
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        /**
         * chart ?????? ????????? ?????????
         */
        innerRadius={0.5}
        /**
         * pad ??????
         */
        padAngle={0.7}
        /**
         * pad radius ?????? (pad??? ????????? ?????? ??? ??????)
         */
        cornerRadius={3}
        /** */
        activeOuterRadiusOffset={8}
        /**
         * chart ??????
         */
        //colors={['red', 'aqua', 'orange']} // ??????????????? ????????? ???
        colors={{ scheme: 'pastel2' }} // nivo?????? ??????????????? ?????? ?????? ????????? ???
        // yellow_orange_red, pastel2
        /**
         * pad border ?????? ??????
         */
        borderWidth={1}
        /** border color */
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        /**
         * link label skip??? ?????? ??????
         */
        arcLinkLabelsSkipAngle={10}
        /**
         * link label ??????
         */
        arcLinkLabelsTextColor={{ from: 'color', modifiers: [] }}
        /**
         * link label ???????????? ??? ??????
         */
        arcLinkLabelsThickness={2}
        /**
         * link label ???????????? ??? ??????
         */
        arcLinkLabelsColor="white" // pad ????????? ?????????
        /**
         * label (pad??? ???????????? ??????) skip??? ?????? ??????
         */
        arcLabelsSkipAngle={10}
        // arcLinkLabelsDiagonalLength={26}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        theme={{
          /**
           * label style (pad??? ???????????? ??????)
           */
          labels: {
            text: {
              fontSize: 17,
              fill: "#000000",
            },
          },
        }}
        /**
         * pad ?????? ?????????
         */
        onClick={handle.padClick}
        /**
         * legend ?????? (default??? ????????? ?????? ????????? key ??????)
         */
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 150,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 20,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#999",
                },
              },
            ],
          },
        ]}
      />
    </div>
  )
}

export default PiechartDoneCategoriesDateRange
