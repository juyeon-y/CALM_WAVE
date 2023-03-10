import React, { useState, useEffect } from "react"
import axios from "axios"
import { ResponsivePie } from "@nivo/pie"
/* eslint-disable */
function PiechartDoneWorksBeforeAim(props) {
  const [doneWorkTotalCount, setDoneWorkTotalCount] = useState(0)
  const [doneBeforeAimCount, setDoneBeforeAimCount] = useState(0)

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

  const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    let total = 0
    dataWithArc.forEach((datum) => {
      total += datum.value
    })

    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        style={{
          fontSize: "70px",
        }}
      >
        {Math.round((doneBeforeAimCount / doneWorkTotalCount) * 100) || 0 + "%"}
      </text>
    )
  }

  useEffect(() => {
    if (startDate && endDate) {
      const fetchWork = async () => {
        try {
          const [result1, result2] = await axios.all([
            axios.get(
              `https://i8a105.p.ssafy.io/api/v1/data/mypage/done-works/${startDate}/${endDate}`,
              {}
            ),
            axios.get(
              `https://i8a105.p.ssafy.io/api/v1/data/mypage/done-before-aim-works-cnt/${startDate}/${endDate}`,
              {}
            ),
          ])
          setDoneWorkTotalCount(Object.keys(result1.data).length)
          setDoneBeforeAimCount(result2.data)
        } catch (error) {
          console.error(error)
        }
      }

      fetchWork()
    }
  }, [startDate, endDate, doneWorkTotalCount, doneBeforeAimCount])

  const handle = {
    padClick: (data) => {
      console.log(data)
    },

    legendClick: (data) => {
      console.log(data)
    },
  }

  return (
    // chart height??? 100%?????? ????????? chart??? ?????? ????????? ????????? height ??????
    <div style={{ width: "800px", height: "500px", margin: "0 auto" }}>
      <ResponsivePie
        /**
         * chart??? ????????? ?????????
         */
        data={[
          {
            id: "???????????? ?????? ?????? ??????",
            value:
              Math.round((doneBeforeAimCount / doneWorkTotalCount) * 100) || 0,
          },
          {
            id: "???????????? ?????? ????????? ?????? ??????",
            value:
              Math.round(
                ((doneWorkTotalCount - doneBeforeAimCount) /
                  doneWorkTotalCount) *
                  100
              ) || 0,
          },
        ]}
        /*
                    works.map(work => ({
                        id : work.title, 
                        value: Math.round((work.totalTime / totalMinutes) * 100)
                    }))
                    */

        valueFormat={(value) => `${Number(value)}%`}
        /**
         * chart margin
         */
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        /**
         * chart ?????? ????????? ?????????
         */
        innerRadius={0.8}
        enableArcLabels={false}
        layers={[
          "arcs",
          "arcLabels",
          "arcLinkLabels",
          "legends",
          CenteredMetric,
        ]}
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
        colors={{ scheme: "pastel2" }} // nivo?????? ??????????????? ?????? ?????? ????????? ???
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
        arcLinkLabelsTextColor={{ from: "color", modifiers: [] }}
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
            itemWidth: 180,
            itemHeight: 1,
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

export default PiechartDoneWorksBeforeAim
