import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginMainContainer: {
    flex: 1,
    backgroundColor: '#2A2D34',
    justifyContent: 'space-between',
    padding: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#2A2D34',
    padding: 20,
  },
  routineHeader: {
    alignItems: 'center',
  },
  routineTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7e94c5',
    fontFamily: 'system-ui',
    marginBottom: 10,
    paddingTop: 50,
  },
  routineDescription: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'system-ui',
    textAlign: 'center',
  },
  exerciseList: {
    flexGrow: 1,
  },
  exerciseItem: {
    backgroundColor: '#3C4047',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'system-ui',
  },
  exerciseDetails: {
    backgroundColor: '#8f99b3',
    padding: 30,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  exerciseDetailsText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'system-ui',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#FFFFFF',
    fontFamily: 'system-ui',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
    fontSize: 18,
    color: '#333',
    backgroundColor: '#f5f5f5',
    fontFamily: 'system-ui',
    borderRadius: 8,
  },
  react: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2D34',
    padding: 20,
  },
  startRoutineButton: {
    backgroundColor: '#7e94c5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  startRoutineButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'system-ui',
    fontWeight: 'bold',
  },
  exerciseHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  exerciseTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#7e94c5',
    textAlign: 'center',
    fontFamily: 'system-ui',
  },
  estimatedTime: {
    fontSize: 18,
    marginBottom: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'system-ui',
  },
  exerciseContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routineContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: '#7e94c5',
    borderRadius: 30,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bottomButtonContainer: {
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#b0b0b0', // Cambia el color para indicar que está deshabilitado
  },
  clearPersistenceButtonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  clearPersistenceButton: {
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 8,
  },
  clearPersistenceButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
