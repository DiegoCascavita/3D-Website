import * as THREE from 'three'
import * as dat from 'lil-gui'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

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
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 2 
mesh2.position.x = -2 
mesh3.position.x = 2 

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++){
    positions [i * 3 + 0] = (Math.random() - 0.5) * 10 //x
    positions [i * 3 + 1] = objectsDistance * 0.4 -   //z
    Math.random()  * objectsDistance * sectionMeshes.length
    positions [i * 3 + 2] = (Math.random() - 0.5) *10 //y
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position',
 new THREE.BufferAttribute(positions,3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation : true,
    size: 0.03
})
//Points
const particles = new THREE.Points (particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 1)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
camera.position.z = 6
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
window.addEventListener("scroll", ()=>{
    scrollY = window.scrollY
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener("mousemove", (event)=>{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5

})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
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
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) *5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y)
    *5 * deltaTime
   //Animate meshes
    for(const mesh of sectionMeshes){
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
 * Base
 */
// Debug
const gui1 = new dat.GUI()

// Canvas
const canvas1 = document.querySelector('canvas.webgl')

// Scene
const scene1 = new THREE.Scene()

/**
 * Textures
 */
const textureLoader1 = new THREE.TextureLoader()
const matcapTexture = textureLoader1.load('textures/matcaps/8.png')

/**
 * Fonts
 */
const fontLoader1 = new FontLoader()

fontLoader1.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        // Material
        const material = new THREE.MeshNormalMaterial({ matcap: matcapTexture })

        // Text
        const textGeometry = new TextGeometry(
            'Welcome !!',
            {
                font: font,
                size: 0.5,
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

        for(let i = 0; i < 100; i++)
        {
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

window.addEventListener('resize', () =>
{
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
 * Camera
 */
// Base camera
const camera1 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera1.position.x = 1
camera1.position.y = 1
camera1.position.z = 2
scene.add(camera1)

// Controls
const controls1 = new OrbitControls(camera1, canvas)
controls1.enableDamping = true

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

const tick1 = () =>
{
    const elapsedTime = clock1.getElapsedTime()

    // Update controls
    controls1.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick1)
}

tick1()