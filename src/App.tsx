import { composeQrCode, composeSetupUri } from 'homekit-code/lib/commands/qrcode/qrcode.utils'
import { composeTag } from 'homekit-code/lib/commands/tag/tag.utils'
import { CATEGORIES } from 'homekit-code/lib/config/categories'

import { Button, Container, MenuItem, Select, SelectChangeEvent, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const generateImage = (category: string, pairingCode: string, connectionMode: string, type: number) => {
  pairingCode = pairingCode.replace("-", "")
  const setupUri = composeSetupUri({
    categoryId: parseInt(category),
    flag: parseInt(connectionMode),
    password: pairingCode,
    setupId: "",
  })
  if (type == 1)
    return composeQrCode({ pairingCode: pairingCode, setupUri })
  else
    return Promise.resolve(composeTag(pairingCode))
}



function App() {

  const [svg, setSvg] = useState("")
  const [checked, setChecked] = useState(false)
  const [category, setCategory] = useState("1")
  const [connectionMode, setConnectionMode] = useState("2")
  const [pairingCode, setPairingCode] = useState('')



  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => setChecked(event.target.checked)
  const onCategoryChange = (event: SelectChangeEvent) => setCategory(event.target.value)
  const onConnectionModeChange = (event: SelectChangeEvent) => setConnectionMode(event.target.value)
  const onGenerateClick = () => generateImage(category, pairingCode, connectionMode, checked ? 1 : 2).then(setSvg)

  const onPairingCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value.replace(/\D/g, '') // Remove all non-numeric characters
    if (input.length > 4) {
      input = `${input.slice(0, 4)}-${input.slice(4, 8)}`  // Add hyphen after the 4th digit
    }
    setPairingCode(input)
  }

  return (
    <Container maxWidth="sm">
      <Typography align='center' variant="h2">Homekit Code Generator</Typography>
      <Typography align='center' gutterBottom><small>Using <a href="https://github.com/SimonGolms/homekit-code">simongolms/homekit-code</a></small></Typography>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography>Tag</Typography>
          <Switch value={checked} onChange={onSwitchChange} />
          <Typography>QRCode</Typography>
        </Stack>

        <TextField
          label="Pairing Code"
          onChange={onPairingCodeChange}
          value={pairingCode}
          placeholder='1234-5678'
          variant="outlined" />

        {checked && <Select
          value={category}
          label="Category"
          onChange={onCategoryChange}
        >
          {
            Object.keys(CATEGORIES).map(c => <MenuItem value={(CATEGORIES as any)[c]}>{c}</MenuItem>)
          }
        </Select>
        }

        {checked && <Select
          value={connectionMode}
          label="Connection TYpe"
          onChange={onConnectionModeChange}
        >
          <MenuItem value="1">NFC</MenuItem>
          <MenuItem value="2">IP</MenuItem>
          <MenuItem value="4">BLE</MenuItem>
        </Select>
        }

        <Button onClick={onGenerateClick}>Generate</Button>


        {svg && <img style={{ height: "50vh" }} src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} />}
      </Stack>


    </Container >
  )
}

export default App
