export class MagicBlueBulb {
    private characteristic: BluetoothRemoteGATTCharacteristic;
    private serviceId = 0xffe5;
    private charId = 0xffe9;
    
    constructor() {
    }

    async init() {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [this.serviceId] }]
        });
        await this.connect(device);
    }

    async connect(device: BluetoothDevice) {
        const gatt = await device.gatt.connect();
        const service = await gatt.getPrimaryService(this.serviceId);
        this.characteristic = await service.getCharacteristic(this.charId);
    }

    write(bytes: number[]) {
        return this.characteristic.writeValue(new Uint8Array(bytes));
    }

    disconnect() {
        this.characteristic.service.device.gatt.disconnect();
        this.characteristic = null;
    }

    setColor(red: number, green: number, blue: number) {
        return this.write([0x56, red, green, blue, 0x00, 0xf0, 0xaa]);
    }

    setWarmWhite(brightness: number) {
        return this.write([0x56, 0, 0, 0, brightness, 0x0f, 0xaa]);
    }

    presetMode(preset: number, speed: number) {
        return this.write([0xbb, preset, speed, 0x44]);
    }

    powerOn() {
        return this.write([0xcc, 0x23, 0x33]);
    }

    powerOff() {
        return this.write([0xcc, 0x24, 0x33]);
    }
}
