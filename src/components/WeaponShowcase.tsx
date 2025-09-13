import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Rocket, Target, Zap, RotateCcw, AlertTriangle } from 'lucide-react';
import launcherImage from '@/assets/custom-launcher.png';
import explosionImage from '@/assets/explosion-effect.png';

interface LauncherState {
  ammo: number;
  maxAmmo: number;
  cooldown: number;
  maxCooldown: number;
  status: 'ready' | 'fired' | 'cooldown' | 'reloading';
  projectileActive: boolean;
}

export const WeaponShowcase = () => {
  const [launcherState, setLauncherState] = useState<LauncherState>({
    ammo: 4,
    maxAmmo: 4,
    cooldown: 0,
    maxCooldown: 100,
    status: 'ready',
    projectileActive: false,
  });

  const [showExplosion, setShowExplosion] = useState(false);
  const [mvpLayer, setMvpLayer] = useState<'model' | 'view' | 'presenter'>('presenter');

  // Cooldown timer
  useEffect(() => {
    if (launcherState.cooldown > 0) {
      const timer = setTimeout(() => {
        setLauncherState(prev => ({
          ...prev,
          cooldown: Math.max(0, prev.cooldown - 2),
          status: prev.cooldown <= 2 ? 'ready' : prev.status
        }));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [launcherState.cooldown]);

  const handleFire = () => {
    if (launcherState.ammo <= 0 || launcherState.status !== 'ready') return;
    
    setLauncherState(prev => ({
      ...prev,
      ammo: prev.ammo - 1,
      status: 'fired',
      projectileActive: true,
      cooldown: 30
    }));
  };

  const handleDetonate = () => {
    if (!launcherState.projectileActive) return;
    
    setShowExplosion(true);
    setLauncherState(prev => ({
      ...prev,
      projectileActive: false,
      status: 'cooldown',
      cooldown: 70
    }));

    setTimeout(() => setShowExplosion(false), 1000);
  };

  const handleReload = () => {
    if (launcherState.ammo === launcherState.maxAmmo) return;
    
    setLauncherState(prev => ({
      ...prev,
      status: 'reloading',
      cooldown: 100
    }));

    setTimeout(() => {
      setLauncherState(prev => ({
        ...prev,
        ammo: prev.maxAmmo,
        status: 'ready',
        cooldown: 0
      }));
    }, 2000);
  };

  const getStatusColor = () => {
    switch (launcherState.status) {
      case 'ready': return 'bg-secondary';
      case 'fired': return 'bg-accent';
      case 'cooldown': return 'bg-primary';
      case 'reloading': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const MVPLayerContent = () => {
    switch (mvpLayer) {
      case 'model':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-glow">🧠 Model Layer</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="gradient-dark p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-primary">Physics Engine</h4>
                <p className="text-sm text-muted-foreground">Projectile trajectory, gravity effects, collision detection</p>
              </div>
              <div className="gradient-dark p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-secondary">Damage System</h4>
                <p className="text-sm text-muted-foreground">Splash radius: 5m, Direct: 110 DMG, Splash: 80 DMG</p>
              </div>
              <div className="gradient-dark p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-accent">State Management</h4>
                <p className="text-sm text-muted-foreground">Ammo: {launcherState.ammo}/{launcherState.maxAmmo}, Status: {launcherState.status}</p>
              </div>
              <div className="gradient-dark p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-destructive">Cooldown Logic</h4>
                <p className="text-sm text-muted-foreground">Fire rate: 0.7s, Reload: 2.0s, Remote detonation</p>
              </div>
            </div>
          </div>
        );
      case 'view':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-glow">👁️ View Layer</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="gradient-dark p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-primary">3D Rendering</h4>
                <p className="text-sm text-muted-foreground">Weapon model, projectile trail, muzzle flash</p>
              </div>
              <div className="gradient-dark p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-secondary">VFX System</h4>
                <p className="text-sm text-muted-foreground">Explosion particles, smoke trails, impact effects</p>
              </div>
              <div className="gradient-dark p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-accent">UI Elements</h4>
                <p className="text-sm text-muted-foreground">Ammo counter, crosshair, cooldown indicators</p>
              </div>
              <div className="gradient-dark p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-destructive">Audio System</h4>
                <p className="text-sm text-muted-foreground">Fire sound, explosion audio, reload effects</p>
              </div>
            </div>
          </div>
        );
      case 'presenter':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-glow">🎮 Presenter Layer</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="gradient-dark p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-primary">Input Handler</h4>
                <p className="text-sm text-muted-foreground">Mouse click to fire, right-click to detonate, R to reload</p>
              </div>
              <div className="gradient-dark p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-secondary">Validation</h4>
                <p className="text-sm text-muted-foreground">Check ammo availability, cooldown status, valid targets</p>
              </div>
              <div className="gradient-dark p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-accent">Coordination</h4>
                <p className="text-sm text-muted-foreground">Updates Model state, triggers View animations</p>
              </div>
              <div className="gradient-dark p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-destructive">Event System</h4>
                <p className="text-sm text-muted-foreground">Damage events, kill confirmations, score updates</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-glow">Custom Launcher MVP</h1>
          <p className="text-xl text-muted-foreground">Fortnite Chapter 2 Season 2 • Remote Detonation System</p>
          <Badge className="gradient-primary text-primary-foreground font-bold">Mythic Weapon</Badge>
        </div>

        {/* Main Showcase */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weapon Display */}
          <Card className="gradient-dark border-border p-8 relative overflow-hidden">
            <div className="text-center space-y-6">
              <div className="relative">
                <img 
                  src={launcherImage} 
                  alt="Custom Launcher" 
                  className="w-64 h-64 mx-auto object-contain drop-shadow-2xl"
                />
                {showExplosion && (
                  <img 
                    src={explosionImage} 
                    alt="Explosion Effect" 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 object-contain animate-pulse"
                  />
                )}
                {launcherState.projectileActive && (
                  <div className="absolute top-4 right-4 animate-bounce">
                    <div className="w-4 h-4 bg-accent rounded-full shadow-accent"></div>
                  </div>
                )}
              </div>

              {/* Status Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={getStatusColor()}>{launcherState.status.toUpperCase()}</Badge>
                </div>
                <Progress value={(100 - launcherState.cooldown)} className="h-2" />
              </div>

              {/* Ammo Counter */}
              <div className="flex justify-center space-x-2">
                {Array.from({ length: launcherState.maxAmmo }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-8 rounded-sm ${
                      i < launcherState.ammo ? 'bg-accent' : 'bg-muted'
                    } transition-smooth`}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="fire"
                  onClick={handleFire}
                  disabled={launcherState.ammo <= 0 || launcherState.status !== 'ready'}
                  className="flex-col h-16"
                >
                  <Rocket className="w-5 h-5" />
                  FIRE
                </Button>
                <Button
                  variant="gaming"
                  onClick={handleDetonate}
                  disabled={!launcherState.projectileActive}
                  className="flex-col h-16"
                >
                  <Target className="w-5 h-5" />
                  DETONATE
                </Button>
                <Button
                  variant="stealth"
                  onClick={handleReload}
                  disabled={launcherState.ammo === launcherState.maxAmmo || launcherState.status === 'reloading'}
                  className="flex-col h-16"
                >
                  <RotateCcw className="w-5 h-5" />
                  RELOAD
                </Button>
              </div>
            </div>
          </Card>

          {/* MVP Layer Selector */}
          <Card className="gradient-dark border-border p-8">
            <div className="space-y-6">
              <div className="flex space-x-2">
                <Button
                  variant={mvpLayer === 'model' ? 'gaming' : 'stealth'}
                  onClick={() => setMvpLayer('model')}
                  size="sm"
                >
                  Model
                </Button>
                <Button
                  variant={mvpLayer === 'view' ? 'gaming' : 'stealth'}
                  onClick={() => setMvpLayer('view')}
                  size="sm"
                >
                  View
                </Button>
                <Button
                  variant={mvpLayer === 'presenter' ? 'gaming' : 'stealth'}
                  onClick={() => setMvpLayer('presenter')}
                  size="sm"
                >
                  Presenter
                </Button>
              </div>

              <MVPLayerContent />
            </div>
          </Card>
        </div>

        {/* Technical Specs */}
        <Card className="gradient-dark border-border p-8">
          <h2 className="text-2xl font-bold text-glow mb-6">Technical Specifications</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-primary flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Weapon Stats
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Damage: 110 (Direct) / 80 (Splash)</li>
                <li>• Splash Radius: 5 meters</li>
                <li>• Fire Rate: 0.7 seconds</li>
                <li>• Reload Time: 2.0 seconds</li>
                <li>• Magazine Size: 4 rockets</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-secondary flex items-center gap-2">
                <Target className="w-5 h-5" />
                Special Features
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Remote detonation capability</li>
                <li>• Silent projectile flight</li>
                <li>• Stealth tracking system</li>
                <li>• Enhanced splash damage</li>
                <li>• Mythic rarity effects</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-accent flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                MVP Integration
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Model handles all game logic</li>
                <li>• View manages visual feedback</li>
                <li>• Presenter coordinates user input</li>
                <li>• Separation of concerns</li>
                <li>• Modular architecture</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};