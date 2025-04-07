"use client"

import { useEffect, useRef } from "react"

export function CircuitEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Circuit parameters
    const nodeSize = 3
    const nodeColor = "#00ff7f"
    const lineColor = "rgba(0,255,127,0.5)"
    const lineWidth = 1
    const gridSize = 40
    const nodeCount = Math.floor((canvas.width / gridSize) * (canvas.height / gridSize))

    // Create nodes with positions aligned to grid
    const nodes: { x: number; y: number; connected: boolean; connections: number[] }[] = []

    for (let y = gridSize; y < canvas.height; y += gridSize) {
      for (let x = gridSize; x < canvas.width; x += gridSize) {
        // Add random offset to grid positions
        const offsetX = (Math.random() - 0.5) * gridSize * 0.5
        const offsetY = (Math.random() - 0.5) * gridSize * 0.5

        // Only add node with 60% probability
        if (Math.random() < 0.6) {
          nodes.push({
            x: x + offsetX,
            y: y + offsetY,
            connected: false,
            connections: [],
          })
        }
      }
    }

    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      // Get 2-3 closest nodes to connect to
      const connections = findClosestNodes(node, nodes, 3)

      for (const connIdx of connections) {
        node.connections.push(connIdx)
        nodes[connIdx].connected = true
        node.connected = true
      }
    }

    function findClosestNodes(node: { x: number; y: number }, allNodes: { x: number; y: number }[], count: number) {
      const distances: { index: number; distance: number }[] = []

      for (let i = 0; i < allNodes.length; i++) {
        if (node === allNodes[i]) continue

        const dx = node.x - allNodes[i].x
        const dy = node.y - allNodes[i].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Only connect if within reasonable distance
        if (distance < gridSize * 2) {
          distances.push({ index: i, distance })
        }
      }

      // Sort by distance
      distances.sort((a, b) => a.distance - b.distance)

      // Return the indices of the closest nodes, limited by count
      return distances.slice(0, count).map((d) => d.index)
    }

    function drawCircuit() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.strokeStyle = lineColor
      ctx.lineWidth = lineWidth

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        // Draw lines to connected nodes
        for (const connIdx of node.connections) {
          const connectedNode = nodes[connIdx]
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(connectedNode.x, connectedNode.y)
          ctx.stroke()
        }
      }

      // Draw nodes
      ctx.fillStyle = nodeColor

      for (const node of nodes) {
        if (node.connected) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Animate a pulse
      animatePulse()
    }

    // Pulse animation
    const pulses: { x: number; y: number; size: number; alpha: number; targetNode: number }[] = []

    function startNewPulse() {
      if (nodes.length === 0) return

      // Select random node as starting point
      const startNodeIdx = Math.floor(Math.random() * nodes.length)
      const startNode = nodes[startNodeIdx]

      if (startNode.connections.length > 0) {
        // Select random target node from connections
        const targetNodeIdx = startNode.connections[Math.floor(Math.random() * startNode.connections.length)]

        pulses.push({
          x: startNode.x,
          y: startNode.y,
          size: nodeSize * 1.5,
          alpha: 1,
          targetNode: targetNodeIdx,
        })
      }

      // Schedule next pulse
      setTimeout(startNewPulse, Math.random() * 1000 + 500)
    }

    function animatePulse() {
      ctx.lineWidth = 2

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i]
        const targetNode = nodes[pulse.targetNode]

        // Calculate direction vector
        const dx = targetNode.x - pulse.x
        const dy = targetNode.y - pulse.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 5) {
          // Reached target, remove pulse
          pulses.splice(i, 1)

          // Potentially continue to next node
          if (Math.random() < 0.7 && targetNode.connections.length > 0) {
            const nextNodeIdx = targetNode.connections[Math.floor(Math.random() * targetNode.connections.length)]
            pulses.push({
              x: targetNode.x,
              y: targetNode.y,
              size: nodeSize * 1.5,
              alpha: 1,
              targetNode: nextNodeIdx,
            })
          }

          continue
        }

        // Move pulse along the line
        const speed = 2
        const normDx = dx / distance
        const normDy = dy / distance

        pulse.x += normDx * speed
        pulse.y += normDy * speed

        // Draw pulse
        ctx.fillStyle = `rgba(0,255,127,${pulse.alpha})`
        ctx.beginPath()
        ctx.arc(pulse.x, pulse.y, pulse.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Start drawing
    drawCircuit()

    // Start pulse animation
    startNewPulse()

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawCircuit()
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50 opacity-20" />
}

