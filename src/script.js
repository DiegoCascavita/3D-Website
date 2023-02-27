import * as THREE from 'three'
// import * as dat from 'lil-gui'

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

/**
 * Debug
 */
const parameters = {
    materialColor: '#ffeded'
}


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load("textures/gradients/3.jpg")
gradientTexture.magFilter = THREE.NearestFilter
/**
 * Objects the MeshToon only appears with light
 */
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture,
    wireframe: true
})

//MESHES
const objectsDistance = 4

const mesh1 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 10),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
mesh1.visible = false;
mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 3
mesh2.position.x = -1.2
mesh3.position.x = 1.2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */
// Geometry
const particlesCount = 10000
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10 //x
    positions[i * 3 + 1] = objectsDistance * 0.4 -   //z
        Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 //y
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position',
    new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})
//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

// Camera Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)


// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 7
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // to set transparent the background
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
window.addEventListener("scroll", () => {
    scrollY = window.scrollY
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5

})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

// Giroscope event
window.addEventListener('deviceorientation', (event) => {
    // Obtener la orientación del dispositivo
    const beta = event.beta; // Inclinación hacia delante/atrás
    const gamma = event.gamma; // Inclinación hacia los lados
  
    // Limitar la inclinación máxima en el eje X y el eje z
    const betaLimited = Math.min(10, Math.max(-10, beta));
    const gammaLimited = Math.min(10, Math.max(-10, gamma));
  
    // Convertir los valores de la orientación a radianes
    const betaRad = betaLimited * Math.PI / 180;
    const gammaRad = gammaLimited * Math.PI / 180;
  
    // Ajustar la posición de la cámara y los objetos en la escena
    cameraGroup.rotation.x = betaRad * 0.5;
    cameraGroup.rotation.z = gammaRad * 0.5;
});

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //CAMERA 
    //IMPORTANT ! - - - - - - - - - - - - - - - - - - - -
    camera.position.y = - scrollY / sizes.height * objectsDistance
    //- - - - - - - - - - - - - - -- - - - - - - - -- - - - -

    //PARALLAX animation
    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y)
        * 5 * deltaTime
    //Animate meshes
    for (const mesh of sectionMeshes) {
        mesh.rotation.x = elapsedTime * 0.1
        mesh.rotation.y = elapsedTime * 0.1
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
//-------------------- 3d text ----------------
/**
/**
 * Fonts
 */
const fontLoader1 = new FontLoader()

fontLoader1.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        // Material
        const material = new THREE.MeshNormalMaterial({})

        // Text
        const textGeometry = new TextGeometry(
            'Welcome!',
            {
                font: font,
                size: 0.3,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()

        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        // Donuts
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)
        
        for (let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(donutGeometry, material)
            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
        }
    }
)

/**
 * Sizes
 */
const sizes1 = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes1.width = window.innerWidth
    sizes1.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Renderer
 */
const renderer1 = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer1.setSize(sizes.width, sizes.height)
renderer1.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock1 = new THREE.Clock()

const tick1 = () => {
    const elapsedTime1 = clock1.getElapsedTime()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick1)
}
tick1()
//-------------------------- FOX


/**
 * Models
 */
const gltfLoader = new GLTFLoader()

let mixer = null

gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) => {

        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[2])
        action.play()

        gltf.scene.scale.set(0.014, 0.014, 0.014)
        scene.add(gltf.scene)
        gltf.scene.position.y = -13
        gltf.scene.position.z = -0.2
        gltf.scene.rotation.y = -1
    }
)


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#006600',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
floor.position.y = -13;
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight2.castShadow = true
directionalLight2.shadow.mapSize.set(1024, 1024)
directionalLight2.shadow.camera.far = 15
directionalLight2.shadow.camera.left = - 7
directionalLight2.shadow.camera.top = 7
directionalLight2.shadow.camera.right = 7
directionalLight2.shadow.camera.bottom = - 7
directionalLight2.position.set(5, 5, 5)
scene.add(directionalLight2)


// Controls
// const controls2 = new OrbitControls(camera, canvas)
// controls2.target.set(0, 0.75, 0)
// controls2.enableDamping = true

/**
 * Renderer
 */
const renderer2 = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer2.shadowMap.enabled = true
renderer2.shadowMap.type = THREE.PCFSoftShadowMap
renderer2.setSize(sizes.width, sizes.height)
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock2 = new THREE.Clock()
let previousTime2 = 0

const tick2 = () => {
    const elapsedTime = clock2.getElapsedTime()
    const deltaTime = elapsedTime - previousTime2
    previousTime2 = elapsedTime

    //Update Mixer
    if (mixer !== null) {
        mixer.update(deltaTime)
    }
    // Call tick again on the next frame
    window.requestAnimationFrame(tick2)
}

tick2()

