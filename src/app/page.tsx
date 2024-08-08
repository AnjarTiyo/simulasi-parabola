'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState } from 'react';

interface Results {
  time: string;
  range: string;
  maxHeight: string;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [velocity, setVelocity] = useState<number>(100);
  const [angle, setAngle] = useState<number>(45);
  const [mass, setMass] = useState<number>(5);
  const [drag, setDrag] = useState<number>(0.1);
  const [timeCompression, setTimeCompression] = useState<number>(10);
  const [results, setResults] = useState<Results>({ time: '', range: '', maxHeight: '' });

  const degreeToRadian = (degree: number): number => degree * Math.PI / 180;

  const draw = (Vo: number, angle: number, timeCompression: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.resetTransform();
    ctx.transform(1, 0, 0, -1, 0, canvas.height);
    ctx.fillStyle = 'blue';

    const Vx = Vo * Math.cos(angle);
    const Vy = Vo * Math.sin(angle);
    const g = 9.8;

    const start_time = Date.now();

    const timeOfFlight = (2 * Vy) / g;
    const maxRange = Vx * timeOfFlight;
    const maxHeight = (Vy * Vy) / (2 * g);

    setResults({
      time: `${timeOfFlight.toFixed(2)}`,
      range: `${maxRange.toFixed(2)}`,
      maxHeight: `${maxHeight.toFixed(2)}`,
    });

    function update() {
      const t = (Date.now() - start_time) / (1000 / timeCompression);
      let x = Vx * t;
      let y = Vy * t - (0.5 * g * Math.pow(t, 2));
      ctx!.beginPath();
      ctx!.arc(x, y, 2, 0, 2 * Math.PI);
      ctx!.fill();
      if (y < 0) return;
      setTimeout(update, t);
    }

    update();
  };

  const startSimulation = () => {
    const radianAngle = degreeToRadian(angle);
    draw(velocity, radianAngle, timeCompression);
  };

  return (
    <>
      <h1 className='text-3xl p-4'>Simulasi Gerak Parabola by Anjar UPGRIS</h1>
      <Card className='flex flex-row mt-2 mx-4 gap-2 p-4' id='config'>
        <CardHeader className='w-[30%]'>
          <CardTitle>Cara Penggunaan</CardTitle>
          <CardDescription className='text-sm text-justify '>Click Buka konfigurasi untuk mengatur konfigurasi. Anda bisa mengatur Kecepatan Mula, Sudut Arah, Berat Benda, Kecepatan Simulasi. Klik mulai untuk memulai simulasi</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-row gap-4 w-[50%]'>
          <div className='flex flex-col w-[40%]'>
            <div className='flex flex-col gap-2'>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant='outline'>Buka Konfigurasi</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className='mx-auto w-full max-w-sm'>
                    <DrawerHeader>
                      <DrawerTitle>Konfigurasi Simulasi</DrawerTitle>
                      <DrawerDescription>Atur konfigurasi simulasi</DrawerDescription>
                    </DrawerHeader>
                    <div className='flex flex-row gap-2'>
                      <label htmlFor="init-velocity">Kecepatan Mula (m/s):</label>
                      <Input
                        type="number"
                        id="init-velocity"
                        value={velocity}
                        onChange={(e) => setVelocity(parseFloat(e.target.value))}
                      />
                    </div>
                    <div className='flex flex-row gap-2'>
                      <label htmlFor="angle">Sudut Luncur (degrees):</label>
                      <Input
                        type="number"
                        id="angle"
                        value={angle}
                        onChange={(e) => setAngle(parseFloat(e.target.value))}
                      />
                    </div>
                    <div className='flex flex-row gap-2'>
                      <label htmlFor="mass">Massa Benda (kg):</label>
                      <Input
                        type="number"
                        id="mass"
                        value={mass}
                        onChange={(e) => setMass(parseFloat(e.target.value))}
                        disabled
                      />
                    </div>
                    <div className='flex flex-row gap-2'>
                      <label htmlFor="drag">Koefisien Hambatan:</label>
                      <Input
                        type="number"
                        id="drag"
                        value={drag}
                        onChange={(e) => setDrag(parseFloat(e.target.value))}
                        disabled
                      />
                    </div>
                    <div className='flex flex-row gap-2'>
                      <label htmlFor="time-compression">Percepat Simulasi:</label>
                      <Input
                        type="number"
                        id="time-compression"
                        value={timeCompression}
                        onChange={(e) => setTimeCompression(parseFloat(e.target.value))}
                      />
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button>Simpan</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>

                </DrawerContent>
              </Drawer>
              <Button onClick={startSimulation}>Mulai Simulasi</Button>
            </div>
          </div>
          <div className='w-[40%]'>
            <Card id="results" className='p-4'>
              <h3 className='text-l font-bold'>Hasil:</h3>
              <div>
                <div className='flex flex-row'>
                  <Label>Waktu tempuh</Label>
                  <Input disabled value={results.time} />
                  <Label>detik</Label>
                </div>
                <div className='flex flex-row gap-2'>
                  <Label>Jarak tempuh</Label>
                  <Input disabled value={results.range} />
                  <Label>meter</Label>
                </div>
                <div className='flex flex-row'>
                  <Label>Ketinggian Maksimal</Label>
                  <Input disabled value={results.maxHeight} />
                  <Label>meter</Label>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
      <Card className='flex flex-row mt-2 mx-4 gap-2 p-4'>
        <canvas
          className="w-full border-black"
          id="canvas"
          ref={canvasRef}
          height={565}
          width={1500}
          >
        </canvas>
      </Card>
    </>
  );
}
