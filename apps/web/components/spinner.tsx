import { BarLoader} from 'react-spinners'

export default function Spinner({ width, height }: { width: string; height: string }) {
  return (
    <div style={{ width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BarLoader color="rgb(255, 230, 204)" />
    </div>
  )
}

